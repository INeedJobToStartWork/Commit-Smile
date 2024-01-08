import { version as PACKAGE_VERSION } from "../package.json";
import type { TStages } from "./utils/types";
import { getConfiguration } from "@/functions";
import { logging, prompter } from "@/utils";
import { spawnSync } from "child_process";
import { program } from "commander";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());

program.version(PACKAGE_VERSION);

program
	.description("Execute Commit Smile application")
	.option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
	.option("-D, --debugger", "Debugger mode", false)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await getConfiguration(options.config);

		const Answers = {
			CHANGES: await prompter.select(config.CHANGES),
			SCOPES: await prompter.select(config.SCOPES),
			COMMIT_SHORT: await prompter.text(config.COMMIT_SHORT),
			COMMIT_DESCRIPTION: (await prompter.text(config.COMMIT_DESCRIPTION)) satisfies string
		} as const satisfies Partial<Record<TStages, unknown>>;

		const commit = `${Answers.CHANGES}(${Answers.SCOPES ? Answers.SCOPES : ""}): ${Answers.COMMIT_SHORT}`;
		logging.info(commit);
		await prompter.confirm(
			"Is this commit valid?",
			false,
			() => {
				spawnSync(`git commit -m "${commit}"`, {
					shell: true,
					stdio: "inherit"
				});
			},
			() => process.exit(1)
		);

		return process.exit(0);
	});

program
	.command("init")
	.description("Init configuration file")
	.action(() => {
		logging.info("Init");
	});

program.parse(process.argv);
