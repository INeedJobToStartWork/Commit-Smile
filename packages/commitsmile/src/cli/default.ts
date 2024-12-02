import { select } from "@/components";
import { getConfiguration } from "@/functions";
import type { TOptionsConfig, TOptionsDebugger } from "@/helpers";
import { optionConfig, optionDebugger } from "@/helpers";
import { logging } from "@/utils";
import { program } from "commander";
import * as prompter from "@clack/prompts";
import { exit } from "node:process";

//----------------------
// Types
//----------------------
/** @internal @dontexport */
type TOptions = TOptionsConfig & TOptionsDebugger;

//----------------------
// CLI APP
//----------------------
program
	.description("Execute Commit Smile application")
	.addOption(optionConfig)
	.addOption(optionDebugger)
	.action(async (options: TOptions) => {
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
						CHANGES: config.formatter.formatter.CHANGES(changes as string),
						SCOPES: config.formatter.formatter.SCOPES(scopes as string[] | string),
						BREAKING_CHANGES: config.formatter.formatter.BREAKING_CHANGES(breakingChanges ?? false),
						COMMIT_SHORT: config.formatter.formatter.COMMIT_SHORT(commitShort ?? "")
					});
					prompter.note(commit);
					let agree = await prompter.confirm({ message: "Commit message is correct?" });
					if (prompter.isCancel(agree) || !agree) {
						prompter.cancel("Commit message is canceled!");
						exit(0);
					}
					return commit;
				}
			},
			{
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					exit(0);
				}
			}
		);
	});

program.parse();




