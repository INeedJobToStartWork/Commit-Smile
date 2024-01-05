import { logging } from "@/utils";
import { existsSync, readdirSync } from "fs";
import path from "path";

/**
 * find config file
 * @param configPath Path to config
 * @returns Path to config if found
 */

export function findConfig(configPath: string): string {
  if (!existsSync(configPath)) {
    logging.error("Path or File does not exist");
    process.exit(1);
  }

  if (path.parse(configPath).ext !== "") {
    logging.debug("Path To File");
    return configPath;
  }

  const files = readdirSync(configPath);
  for (const file of files) {
    logging.debug(`File: ${file}`);
    if (/commitsmile.*\.(json|mjs|cjs|js|mts|cts|ts)/i.exec(file)) {
      logging.debug("Config found");
      return path.join(configPath, file);
    }
  }

  logging.error("Config not found");
  return process.exit(1);
}

export default findConfig;
