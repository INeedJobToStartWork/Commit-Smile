import { version as PACKAGE_VERSION } from "../package.json";
import type { TStages } from "./utils/types";
import { findConfig, readConfig } from "@/functions";
import { logging, prompter } from "@/utils";
import { spawnSync } from "child_process";
import { program } from "commander";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());

program.version(PACKAGE_VERSION);

program
	.option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
	.option("-D, --debugger", "Debugger mode", false)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await readConfig(await findConfig(options.config));

		// const Answers: Partial<Record<TStages, string | string[]>> = {

		// es
		const Answers = {
			CHANGES: await prompter.select(config.CHANGES),
			SCOPES: await prompter.select(config.SCOPES),
			COMMIT_SHORT: await prompter.text(config.COMMIT_SHORT),
			COMMIT_DESCRIPTION: (await prompter.text(config.COMMIT_DESCRIPTION)) satisfies string
		} as const satisfies Partial<Record<TStages, unknown>>;

		const commit = `${Answers.CHANGES}(${Answers.SCOPES ? Answers.SCOPES : ""}): ${Answers.COMMIT_SHORT}`;
		logging.info(commit);
		// "git", ["commit", "-m", commit],
		await prompter.confirm(
			"Is this commit valid?",
			() => {
				spawnSync(`git commit -m "${commit}"`, {
					shell: true,
					stdio: "inherit"
				});
			},
			() => process.exit(1)
		);
		// await prompter.confirm("🚀 Push it?", async () => spawn("git", ["push"], { stdio: "inherit" }));
		//  change app process (index.ts),add utils and types
		return process.exit(0);
	});
program.parse(process.argv);
