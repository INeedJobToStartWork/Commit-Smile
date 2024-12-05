/* eslint-disable new-cap */
import { getConfiguration } from "@/functions";
import type { TOptionsConfig, TOptionsDebugger } from "@/helpers";
import { optionConfig, optionDebugger } from "@/helpers";
import { logging } from "@/utils";
import { program } from "commander";
import { exit } from "node:process";
import * as prompter from "@clack/prompts";
import { select } from "@/components";
import type { IMyError, TMyErrorList } from "oh-my-error";
import { myError, myErrorWrapper } from "oh-my-error";
import { spawnSync } from "node:child_process";

//----------------------
// MyError
//----------------------

/** @internal @dontexport */
const MyErrorList = {
	COMMAND_THROW: {
		code: "COMMAND_THROW",
		name: "Command Throw",
		message: (index: number) => `Command with index '${index}' throwed.`
	}
} satisfies TMyErrorList<IMyError>;

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

		// Cli Prompt Stages
		// TODO: Own group component with better typing
		// TODO: Remove Eslint/TS ignores comments cuz of wrong component Typing.
		const Answers = await prompter.group(
			{
				changes: async () => select(config.prompts.CHANGES),
				scopes: async () => select(config.prompts.SCOPES),
				breakingChanges: async () => prompter.confirm(config.prompts.BREAKING_CHANGES),
				commitShort: async () => prompter.text(config.prompts.COMMIT_SHORT),
				commitDescription: async () => prompter.text(config.prompts.COMMIT_DESCRIPTION),
				// eslint-disable-next-line @typescript-eslint/require-await
				commit: async ({ results }) => {
					const { changes, scopes, commitShort, breakingChanges } = results;

					return {
						CHANGES: config.formatter.formatter.CHANGES(changes as string),
						SCOPES: config.formatter.formatter.SCOPES(scopes as string[] | string),
						BREAKING_CHANGES: config.formatter.formatter.BREAKING_CHANGES(breakingChanges ?? false),
						COMMIT_SHORT: config.formatter.formatter.COMMIT_SHORT(commitShort ?? ""),
						format: function () {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @EslintUnusedImports/no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
							const { format, ...rest } = this as any;
							return config.formatter.format(rest as Parameters<typeof config.formatter.format>[0]);
						}
					} as const;
				},
				isCorrect: async ({ results }) => {
					const { commit } = results;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
					prompter.note((commit as any).format());
					const result = await prompter.confirm({ message: "Commit message is correct?" });
					// TODO: Back to Stages if it's not like they wanted

					if (prompter.isCancel(result) || !result) {
						prompter.cancel("Commit message is canceled!");
						exit(0);
					}
					return result;
				},
				after: async ({ results }): Promise<void> => {
					if (!results.isCorrect) return void 0;
					for (const [index, value] of Object.values(config.finalCommands).entries()) {
						myErrorWrapper(
							() => {
								spawnSync(typeof value == "string" ? value : value(results.commit as Parameters<typeof value>[0]), {
									shell: true,
									stdio: "inherit"
								});
							},
							myError(MyErrorList.COMMAND_THROW, { message: [index] })
						)();
					}
				}
			},
			{
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					exit(0);
				}
			}
		);

		logging.debug(Answers);
	});

program.parse();
