import type { TOptionsConfig, TOptionsDebugger } from "@/helpers";
import { optionConfig, optionDebugger } from "@/helpers";
import { logging } from "@/utils";
import { program } from "commander";
import { getConfiguration, StageRunner } from "@/functions";
import { select } from "@/components";
import * as prompter from "@clack/prompts";
import { exit } from "node:process";
import { myError, myErrorWrapper } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";
import getWorkspaces from "@/functions/getWorkspaces";
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

		const { type, scopes, isBreaking, title, description } = config.prompts;

		const Answers = new StageRunner()
			.addStep(type ? { type: async () => select(type) } : void 0)
			.addStep(
				scopes
					? {
							scopes: async () => {
								let optionsToAdd: Parameters<typeof select>[0]["options"] = [];

								if ("workspaces" in scopes && scopes.workspaces) {
									const foundWorkspaces = Object.keys(getWorkspaces(options.config));
									optionsToAdd = foundWorkspaces.map(repo => ({
										label: `📦 ${String(repo[0]).toUpperCase() + String(repo).slice(1)}`,
										value: repo,
										hint: "Repo"
									}));
								}

								return select({
									...scopes,
									options: [...optionsToAdd, ...("options" in scopes ? scopes.options : [])]
								});
							}
						}
					: void 0
			)
			.addStep(isBreaking ? { isBreaking: async () => prompter.confirm(isBreaking) } : void 0)
			.addStep(title ? { title: async () => prompter.text(title) } : void 0)
			.addStep(
				description
					? {
							description: async () => {
								const choice =
									typeof description == "object" && "always" in description
										? description.always
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
								if (choice == "inline") return prompter.text(description);
								if (choice == "editor") return "editor";
								return void 0;
							}
						}
					: void 0
			)
			.addStep({
				commit: ({ results }) => {
					const { type, scopes, isBreaking, title, description } = results;

					return {
						type: config.formatter.type(type as string),
						scopes: config.formatter.scopes(scopes as string[] | string),
						isBreaking: config.formatter.isBreaking(isBreaking as boolean),
						title: config.formatter.title(title as string),
						description: description,
						format: function () {
							// eslint-disable-next-line @EslintUnusedImports/no-unused-vars, @typescript-eslint/no-unused-vars
							const { format, ...rest } = this;
							return config.formatter.format(rest);
						}
					};
				}
			})
			.addStep({
				isCorrect: async ({ results, order }) => {
					const { commit } = results;
					prompter.note(commit.format());

					const toChange = Object.keys(config.prompts).filter(
						key => config.prompts[key as keyof typeof config.prompts]
					);

					const choice = await select({
						message: "Commit message is correct?",
						required: true,

						options: [
							{ label: "Yes", value: "Yes" },
							...(toChange.length > 0 ? [{ label: "No, i want to change", value: "Change" }] : []),
							{ label: "Cancel", value: "Cancel" }
						]
					} as const);

					logging.debug("Choice", choice);
					if (choice == "Change") {
						const whatToChange = await select({
							message: "Which Stage you want to change?",
							required: true,
							options: toChange.map(el => ({ label: el, value: el }))
						});
						logging.debug("Order", order);
						order.unshift(whatToChange, "commit", "isCorrect");
						logging.debug("Order", order);

						return whatToChange;
					}
					if (choice == "Yes") return true;
					return Symbol("clack:cancel");
				}
			})
			.addStep({
				after: ({ results }): void => {
					if (!results.isCorrect || !config.finalCommands) return;
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
			})
			.execute({
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					exit(0);
				}
			});

		logging.debug(Answers);
	});
