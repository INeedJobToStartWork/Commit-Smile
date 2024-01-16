import def from "../package.json";
import { select } from "./components";
import { getConfiguration } from "@/functions";
import { logging } from "@/utils";
import * as prompter from "@clack/prompts";
import chalk from "chalk";
import { spawnSync } from "child_process";
import { program } from "commander";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());

program.version(def.version);

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
				commitShort: async () => prompter.text(config.COMMIT_SHORT),
				commitDescription: async () => prompter.text(config.COMMIT_DESCRIPTION),
				commit: async ({ results }) => {
					const { changes, scopes, commitShort } = results;
					const commit = (): string => {
						const scopesFormat = scopes ? `(${scopes})` : "";
						return `${changes}${scopesFormat}: ${commitShort}`;
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

// program
// 	.command("init")
// 	.description("Init configuration file")
// 	.action(async () => {
// 		// console.log("JESTEŚMY TU: ", import.meta.url);
// 		// console.log("TWORZYMY TU: ", process.cwd());
// 		const Answers = prompter.group(
// 			{
// 				intro: () => {
// 					prompter.intro(chalk.bgMagenta("Init your config file!"));
// 				},
// 				type: () =>
// 					select({
// 						custom: {
// 							value: false,
// 							amount: 1
// 						},
// 						message: "Select config type:",
// 						required: true,
// 						options: [
// 							{
// 								label: "🟦 Typescript",
// 								value: "ts"
// 							},
// 							{
// 								label: "🟨 Javascript",
// 								value: "js"
// 							}
// 						]
// 					}),
// 				module: () =>
// 					select({
// 						custom: {
// 							value: false,
// 							amount: 1
// 						},
// 						message: "Select module type:",
// 						initialValues: ["cjs"],
// 						options: [
// 							{
// 								label: "EcmaScript",
// 								value: "esm",
// 								hint: "esm"
// 							},
// 							{
// 								label: "CommonJS",
// 								value: "esm",
// 								hint: "cjs"
// 							}
// 						]
// 					}),
// 				outro: () => prompter.outro("Thank you for your answers!")
// 			},
// 			{
// 				onCancel: () => {
// 					prompter.cancel("Operation cancelled.");
// 					process.exit(0);
// 				}
// 			}
// 		);
// 	});

program.parse(process.argv);
