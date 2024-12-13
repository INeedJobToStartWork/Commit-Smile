import { select } from "../components";
import { getConfiguration } from "../functions";
import { optionDebugger } from "../helpers";
import { logging } from "../utils";
import * as prompter from "@clack/prompts";
import { spawnSync } from "node:child_process";
import { program } from "commander";

program
	.description("Execute Commit Smile application")
	// .addOption(optionConfig)
	.addOption(optionDebugger)
	.action(async (options: { config: string; debugger: boolean }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await getConfiguration(options.config);
		const Answers = await prompter.group(
			{
				changes: async () => select(config.prompts.type),
				scopes: async () => select(config.prompts.scopes),
				breakingChanges: async () => prompter.confirm(config.prompts.isBreaking),
				commitShort: async () => prompter.text(config.prompts.title),
				commitDescription: async () => prompter.text(config.prompts.description),
				commit: async ({ results }) => {
					const { changes, scopes, commitShort, breakingChanges } = results;

					const commit = config.formatter.format({
						type: config.formatter.formatter.type.value(changes as string),
						scopes: config.formatter.formatter.scopes.value(scopes as string[] | string),
						isBreaking: config.formatter.formatter.isBreaking.value(breakingChanges ?? false),
						title: config.formatter.formatter.title.value(commitShort ?? "")
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
