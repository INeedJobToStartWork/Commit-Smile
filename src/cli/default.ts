import { select } from "@/components";
import { getConfiguration } from "@/functions";
import { logging } from "@/utils";
import * as prompter from "@clack/prompts";
import { spawnSync } from "child_process";
import { program } from "commander";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());
program
	.description("Execute Commit Smile application")
	.option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
	.option("-D, --debugger", "Debugger mode", false)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await getConfiguration(options.config);
		const Answers = await prompter.group(
			{
				changes: async () => select(config.CHANGES),
				scopes: async () => select(config.SCOPES),
				breakingChanges: async () => prompter.confirm(config.BREAKING_CHANGES),
				commitShort: async () => prompter.text(config.COMMIT_SHORT),
				commitDescription: async () => prompter.text(config.COMMIT_DESCRIPTION),
				commit: async ({ results }) => {
					const { changes, scopes, commitShort, breakingChanges } = results;
					const commit = (): string => {
						const scopesFormat = scopes ? `(${scopes})` : "";
						const breakingChangesFormat = breakingChanges ? "!" : "";
						return `${changes}${scopesFormat}${breakingChangesFormat}: ${commitShort}`;
					};
					prompter.note(commit());
					let agree = await prompter.confirm({ message: "Commit message is correct?" });
					if (prompter.isCancel(agree) || !agree) {
						prompter.cancel("Commit message is canceled!");
						process.exit(0);
					}
					return commit();
				}
			},
			{
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					process.exit(0);
				}
			}
		);
		logging.debug(Answers.commit);
		spawnSync(
			`git commit -m "${Answers.commit}" ${Answers.commitDescription ? `-m "${Answers.commitDescription}"` : ""}`,
			{
				shell: true,
				stdio: "inherit"
			}
		);

		return process.exit(0);
	});
