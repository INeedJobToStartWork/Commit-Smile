import { version } from "../package.json";
import { findConfig, readConfig } from "@/functions";
import { logging } from "@/utils";
import { program } from "commander";
import path from "path";

const PACKAGE_VERSION = version;
const EXECUTED_PATH = path.join(path.resolve());

program.version(PACKAGE_VERSION);

program
  .option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
  .option("-D, --debugger", "Debugger mode", false)
  .action(async (options: { debugger: boolean; config: string }) => {
    process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

    logging.debug("Debug mode enabled");
    logging.debug("Options: ", options);

    const configPath = await readConfig(await findConfig(options.config));

    logging.debug(`Config: ${configPath.template}`);
  });

program.parse(process.argv);
