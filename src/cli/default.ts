import { select } from "@/components";
import { getConfiguration } from "@/functions";
import { optionDebugger, optionConfig } from "@/helpers";
import { logging } from "@/utils";
import * as prompter from "@clack/prompts";
import { spawnSync } from "child_process";
import { program } from "commander";

program
	.description("Execute Commit Smile application")
	.addOption(optionConfig)
	.addOption(optionDebugger)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await getConfiguration(options.config);
		const Answers = await prompter.group(
			{
				changes: async () => select(config.prompts.CHANGES),
				scopes: async () => select(config.prompts.SCOPES),
				breakingChanges: async () => prompter.confirm(config.prompts.BREAKING_CHANGES),
				commitShort: async () => prompter.text(config.prompts.COMMIT_SHORT),
				commitDescription: async () => prompter.text(config.prompts.COMMIT_DESCRIPTION),
				commit: async ({ results }) => {
					const { changes, scopes, commitShort, breakingChanges } = results;

					const commit = config.formatter.format({
						CHANGES: config.formatter.formatter.CHANGES.value(changes as string),
						SCOPES: config.formatter.formatter.SCOPES.value(scopes as string[] | string),
						BREAKING_CHANGES: config.formatter.formatter.BREAKING_CHANGES.value(breakingChanges ?? false),
						COMMIT_SHORT: config.formatter.formatter.COMMIT_SHORT.value(commitShort ?? "")
					});
					prompter.note(commit);
					let agree = await prompter.confirm({ message: "Commit message is correct?" });
					if (prompter.isCancel(agree) || !agree) {
						prompter.cancel("Commit message is canceled!");
						process.exit(0);
					}
					return commit;
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
