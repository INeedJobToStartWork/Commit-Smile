import { findWorkspaces } from "@/functions";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

//----------------------
// Functions
//----------------------

/**
 * Resolves workspace patterns into a map of workspace names to their full paths.
 * Handles include/exclude patterns and filters based on directory existence.
 *
 * @param path - Base directory to resolve workspace patterns from
 * @returns Object mapping workspace names to their absolute paths
 *
 * @example
 * ```typescript
 * const workspaces = getWorkspaces('./');
 * // Returns: { 'pkg-a': '/path/to/pkg-a', 'pkg-b': '/path/to/pkg-b' }
 * ```
 *
 * @remarks
 * - Uses patterns from findWorkspaces()
 * - Supports negative patterns (starting with !) for exclusion
 * - Only includes existing directories
 * - Ignores non-directory entries
 * - Handles glob patterns in ignore rules
 *
 * @throws
 * - May throw if directory operations fail
 * - May throw if filesystem access is denied
 */
const getWorkspaces = (path: string): object => {
	const result: Record<string, string> = {};
	const patterns = findWorkspaces(path);

	const includePatterns = patterns.filter(p => !p.startsWith("!"));
	const ignorePatterns = patterns.filter(p => p.startsWith("!")).map(p => p.slice(1));

	for (const pattern of includePatterns) {
		const baseFolder = join(path, pattern.split("/")[0]);

		if (existsSync(baseFolder)) {
			for (const { name, path } of readdirSync(baseFolder)
				.map(file => ({ name: file, path: join(baseFolder, file) }))
				.filter(({ path }) => {
					if (!statSync(path).isDirectory()) return false;
					return !ignorePatterns.some(ignore => path.includes(ignore.replace("**/**/", "")));
				})) {
				result[name] = path;
			}
		}
	}

	return result;
};

export default getWorkspaces;
