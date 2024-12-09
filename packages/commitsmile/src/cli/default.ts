/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable new-cap */
import { getConfiguration, stageGroup } from "@/functions";
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
		const Answers = await stageGroup(
			{
				changes: async () => select(config.prompts.CHANGES),
				scopes: async () => {
					const { SCOPES } = config.prompts;
					if ("skip" in SCOPES) return [];

					let optionsToAdd: Parameters<typeof select>[0]["options"];

					if ("workspaces" in SCOPES && SCOPES.workspaces) {
						const foundWorkspaces = Object.keys(getWorkspaces(options.config));
						optionsToAdd = foundWorkspaces.map(repo => ({
							label: `📦 ${String(repo[0]).toUpperCase() + String(repo).slice(1)}`,
							value: repo,
							hint: "Repo"
						}));
					}

					return select({ ...SCOPES, options: [...optionsToAdd, ...SCOPES.options] });
				},

				breakingChanges: async () => prompter.confirm(config.prompts.BREAKING_CHANGES),
				commitShort: async () => prompter.text(config.prompts.COMMIT_SHORT),
				commitDescription: async () => {
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
								} as const);

					// @ts-expect-error - Wrong Type checking. if choice == "inline" it have to be filled cuz configParser would crush
					if (choice == "inline") return prompter.text(config.prompts.COMMIT_DESCRIPTION);
					if (choice == "editor") return "editor";
					return void 0;
				},

				commit: ({ results }) => {
					const { changes, scopes, commitShort, commitDescription, breakingChanges } = results;

					return {
						CHANGES: config.formatter.formatter.CHANGES(changes as string),
						SCOPES: config.formatter.formatter.SCOPES(scopes as string[] | string),
						BREAKING_CHANGES: config.formatter.formatter.BREAKING_CHANGES((breakingChanges as boolean) ?? false),
						COMMIT_SHORT: config.formatter.formatter.COMMIT_SHORT(commitShort as string),
						COMMIT_DESCRIPTION: commitDescription,
						format: function () {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @EslintUnusedImports/no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
							const { format, ...rest } = this as any;
							return config.formatter.format(rest as Parameters<typeof config.formatter.format>[0]);
						}
					};
				},
				isCorrect: async ({ results, order }) => {
					const { commit } = results;

					prompter.note(commit.format());

					const choice = await select({
						message: "Commit message is correct?",
						required: true,

						options: [
							{ label: "Yes", value: "Yes" },
							{ label: "No, i want to change", value: "Change" },
							{ label: "Cancel", value: "Cancel" }
						]
					} as const);

					if (choice == "Change") {
						const toChange = ["changes", "scopes", "breakingChanges", "commitShort"] as const;
						const whatToChange = await select({
							message: "Which Stage you want to change?",
							required: true,
							options: toChange.map(el => ({ label: el, value: el }))
						});
						order.push(whatToChange, "commit", "isCorrect");

						return false;
					}
					if (choice == "Yes") return true;
					return Symbol("clack:cancel");
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
