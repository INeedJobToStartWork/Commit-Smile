import { logging } from "../utils";
import { existsSync, readdirSync } from "fs";
import path from "path";

/**
 * find config file
 * @param configPath Path to config
 * @returns Path to config if found
 */

// [string | undefined,boolean]
// [string,true] | [undefined,false]

export function findConfig(configPath: string): string | undefined {
	// Check if the configPath has an extension
	if (path.parse(configPath).ext !== "") {
		// Check if the file exists
		if (!existsSync(configPath)) {
			logging.warn("Config file does not exist - check the path");
			return undefined;
		}
		logging.debug("Path to file found");
		return configPath;
	}
	// /commitsmile(\.[^.]+)*\.(json|mjs|cjs|js|mts|cts|ts)/iu
	// If the configPath is a directory, search for config files
	const files = readdirSync(configPath);
	for (const file of files) {
		logging.debug(`File: ${file}`);
		if (/^commitsmile(\.[^.]+)*\.(json|mjs|cjs|js|mts|cts|ts)/iu.exec(file)) {
			logging.debug("Config found");
			return path.join(configPath, file);
		}
	}

	// If no config file is found, return undefined
	return undefined;
}

export default findConfig;
