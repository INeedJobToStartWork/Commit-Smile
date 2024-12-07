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
import getWorkspaces from "@/functions/getWorkspaces";

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

		logging.debug("ALL WORKSPACES: ", getWorkspaces(options.config));

		// Cli Prompt Stages
		// TODO: Own group component with better typing
		// TODO: Remove Eslint/TS ignores comments cuz of wrong component Typing.
		const Answers = await prompter.group(
			{
				changes: async () => select(config.prompts.CHANGES),
				scopes: async () =>
					// TODO: Option To Show Packages from monoerpos
					// TODO: Option To Show only changed packages,
					// const test = Object.keys(getWorkspaces(options.config));
					// const optionsToAdd = test.map(el => ({
					// 	label: `📦 ${String(el[0]).toUpperCase() + String(el).slice(1)}`,
					// 	value: el,
					// 	hint: "Repo"
					// }));

					// return select({ ...config.prompts.SCOPES, options: [...optionsToAdd, ...config.prompts.SCOPES.options] });
					select(config.prompts.SCOPES),
				breakingChanges: async () => prompter.confirm(config.prompts.BREAKING_CHANGES),
				commitShort: async () => prompter.text(config.prompts.COMMIT_SHORT),
				commitDescription: async () => {
					// const choice =
					// 	config.prompts.COMMIT_DESCRIPTION.always ??
					// 	(await select({
					// 		message: "What do you want to do?",
					// 		required: true,
					// 		options: [
					// 			{ label: "Open Editor", hint: "git config core.editor", value: "editor" },
					// 			{ label: "Inline description", hint: "Go to text prompt", value: "inline" },
					// 			{ label: "Skip", value: "skip" }
					// 		]
					// 	}));

					const choice =
						"always" in config.prompts.COMMIT_DESCRIPTION
							? config.prompts.COMMIT_DESCRIPTION.always
							: await select({
									message: "What do you want to do?",
									required: true,
									options: [
										{ label: "Open Editor", hint: "git config core.editor", value: "editor" },
										{ label: "Inline description", hint: "Go to text prompt", value: "inline" },
										{ label: "Skip", value: "skip" }
									]
								});

					// @ts-expect-error - Wrong Type checking. if choice == "inline" it have to be filled cuz configParser would crush
					if (choice == "inline") return prompter.text(config.prompts.COMMIT_DESCRIPTION);
					if (choice == "editor") return "editor";
					return void 0;
				},
				// eslint-disable-next-line @typescript-eslint/require-await
				commit: async ({ results }) => {
					const { changes, scopes, commitShort, commitDescription, breakingChanges } = results;

					return {
						CHANGES: config.formatter.formatter.CHANGES(changes as string),
						SCOPES: config.formatter.formatter.SCOPES(scopes as string[] | string),
						BREAKING_CHANGES: config.formatter.formatter.BREAKING_CHANGES(breakingChanges ?? false),
						COMMIT_SHORT: config.formatter.formatter.COMMIT_SHORT(commitShort ?? ""),
						COMMIT_DESCRIPTION: commitDescription,
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
					if (!results.isCorrect || !config.finalCommands) return void 0;
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
