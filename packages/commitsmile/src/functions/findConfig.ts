import { logging } from "@/utils";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

//----------------------
// Functions
//----------------------

/**
 * Find config file
 *
 * @param configPath Path to config
 * @returns Path to config if found
 * @dontexport
 */
export function findConfig(configPath: string): string | undefined {
	if (!existsSync(configPath)) return undefined;
	if (path.parse(configPath).ext !== "") {
		logging.debug("Path to file found");
		return configPath;
	}

	// If the configPath is a directory, search for config files
	const files = readdirSync(configPath);
	for (const file of files) {
		logging.debug(`File: ${file}`);
		// eslint-disable-next-line @EslintSecurity/detect-unsafe-regex
		if (/commitsmile(\.[^.]+)*\.(js|ts|mjs|cjs|mts|json|jsonc|json5|yaml|yml|toml)/iu.test(file)) {
			logging.debug("Config found");
			return path.join(configPath, file);
		}
	}

	// If no config file is found, return undefined
	return undefined;
}

export default findConfig;
