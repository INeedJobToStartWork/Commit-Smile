import { logging } from "@/utils";
import { existsSync, readdirSync } from "fs";
import path from "path";

//----------------------
// Functions
//----------------------

/**
 * Find config file
 *
 * @param configPath Path to config
 * @returns Path to config if found
 * @internal @dontexport 
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
		if (/commitsmile(\.[^.]+)*\.(js|ts|mjs|cjs|mts|ts|json|jsonc|json5|yaml|yml|toml)/iu.exec(file)) {
			logging.debug("Config found");
			return path.join(configPath, file);
		}
	}

	// If no config file is found, return undefined
	return undefined;
}

export default findConfig;
