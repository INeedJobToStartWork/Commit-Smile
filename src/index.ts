import { version as PACKAGE_VERSION } from "../package.json";
import type { TStages } from "./utils/types";
import { findConfig, readConfig } from "@/functions";
import { logging, prompter } from "@/utils";
import { spawn } from "child_process";
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

		const Answers: Partial<Record<TStages, string[] | string>> = {
			CHANGES: await prompter.select(config.CHANGES),
			COMMIT_DESCRIPTION: await prompter.text(config.COMMIT_DESCRIPTION),
			COMMIT_SHORT: await prompter.text(config.COMMIT_SHORT),
			SCOPES: await prompter.select(config.SCOPES)
		} as const;

		const commit = `${Answers.CHANGES}(${Answers.SCOPES ?? ""}): ${Answers.COMMIT_SHORT ?? undefined}`;
		logging.info(commit);
		await prompter.confirm(
			"Is this commit valid?",
			async () => spawn("git", ["commit", "-m", commit], { stdio: "inherit" }),
			() => process.exit(1)
		);
		await prompter.confirm("🚀 Push it?", async () => spawn("git", ["push"], { stdio: "inherit" }));

		return process.exit(0);
	});
program.parse(process.argv);
