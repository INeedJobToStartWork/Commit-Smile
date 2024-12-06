/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @EslintImports/no-unassigned-import
import "@total-typescript/ts-reset";
import { parse as parseYAML } from "yaml";
/**
 * npm: package.json at "workspaces":string[]
 * Yarn : package.json at "workspaces":string[]
 * Pnpm: "package.json" at "workspaces":string[] or pnpm-workspace.yaml
 * Deno: "package.json" at "workspaces":string[] or "deno.json" "workspace":string[]
 * Lerna (NPM Package): lerna.json "packages":string[]
 * Nx (NPM Package):
 * BUN:
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

//----------------------
// Functions
//----------------------

/**
 * Searches for workspace configurations in various package manager and monorepo tools' configuration files
 * and returns an array of workspace paths defined in those configurations.
 *
 * Supported configuration files and their corresponding workspace keys:
 * - Deno: deno.json (workspace)
 * - Lerna: lerna.json (packages)
 * - NPM: package.json (workspaces)
 * - PNPM: pnpm-workspace.yaml (packages)
 * - Bun: bun.lockb (workspaces)
 * - NX: nx.json (projects)
 *
 * @param path - The directory path to search for workspace configuration files
 * @returns An array of workspace paths found in the configuration files
 *
 * @example
 * ```typescript
 * // Search for workspaces in the current directory
 * const workspaces = findWorkspaces('./');
 * // Returns: ['packages/*', 'apps/*'] // Example output
 * ```
 *
 * @remarks
 * - The function reads and parses both JSON and YAML configuration files
 * - For YAML files, it uses a YAML parser (not shown in the code)
 * - The function expects configuration files to have a specific structure with workspace definitions
 * - Workspace paths are extracted from the corresponding keys defined in the CONFIGS object
 *
 * @throws
 * - May throw if file reading operations fail
 * - May throw if JSON/YAML parsing fails
 * - May throw if the file system is not accessible
 *
 * @see
 * - Deno Workspaces: {@link https://deno.land/manual@v1.37.0/workspace}
 * - Lerna Packages: {@link https://lerna.js.org/docs/concepts/workspaces}
 * - NPM Workspaces: {@link https://docs.npmjs.com/cli/v7/using-npm/workspaces}
 * - PNPM Workspaces: {@link https://pnpm.io/workspaces}
 * - Bun Workspaces: {@link https://bun.sh/docs/install/workspaces}
 * - NX Projects: {@link https://nx.dev/concepts/mental-model}
 */
export const findWorkspaces = (path: string): string[] => {
	const result: string[] = [];

	/// keep-sorted keep-unique
	const CONFIGS = {
		deno: ["deno.json", "workspace"],
		lerna: ["lerna.json", "packages"],
		npm: ["package.json", "workspaces"],
		pnpm: ["pnpm-workspace.yaml", "packages"],
		bun: ["bun.lockb", "workspaces"],
		nx: ["nx.json", "projects"]
	} as const;

	const files = readdirSync(path);
	// logging.debug(path);

	for (const file of files) {
		for (const [configFile, workspaceKey] of Object.values(CONFIGS)) {
			if (file === configFile) {
				const filePath = path.endsWith(file) ? path.slice(0, -file.length) : join(path, file);
				// logging.debug("TEST:", filePath);
				const content: object = file.endsWith(".yaml")
					? parseYAML(readFileSync(filePath, "utf8"))
					: JSON.parse(readFileSync(filePath, "utf8"));

				if (Object.hasOwn(content, workspaceKey)) {
					const workspaces: string[] = content[workspaceKey as keyof typeof content] as string[];
					if (Array.isArray(workspaces)) result.push(...workspaces);
				}
			}
		}
	}

	return result;
};

export default findWorkspaces;

//----------------------
// Helpers
//----------------------
