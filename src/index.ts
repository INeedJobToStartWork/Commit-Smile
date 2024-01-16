import def from "../package.json";
import { select } from "./components";
import { getConfiguration } from "@/functions";
import { logging } from "@/utils";
import * as prompter from "@clack/prompts";
import chalk from "chalk";
import { spawnSync } from "child_process";
import { program } from "commander";
import { copyFile, existsSync } from "fs";
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

program
	.command("init")
	.description("Init configuration file")
	.action(async () => {
		const EXECUTEFILEPATH = import.meta.url;

		console.log(path.join(EXECUTEFILEPATH));

		const Answers = await prompter.group(
			{
				intro: () => {
					prompter.intro(chalk.bgMagenta("Init your config file!"));
				},
				type: async () =>
					select({
						custom: {
							value: false,
							amount: 1
						},
						message: "Select config type:",
						required: true,
						options: [
							{
								label: "🟦 Typescript",
								value: "ts"
							},
							{
								label: "🟨 Javascript",
								value: "js"
							},
							{
								label: "{} Json",
								value: "json"
							}
						]
					}),
				module: async ({ results }) =>
					results.type === "json"
						? void 0
						: select({
								custom: {
									value: false,
									amount: 1
								},
								message: "Select module type:",
								initialValues: ["cjs"],
								options: [
									{
										label: "EcmaScript",
										value: "esm",
										hint: "esm"
									},
									{
										label: "CommonJS",
										value: "cjs",
										hint: "cjs"
									}
								]
							}),
				filename: async () =>
					prompter.text({
						message: "Enter filename (without ext):",
						initialValue: "commitSmile",
						defaultValue: "commitSmile",
						validate(text) {
							if (/\.(ts|cts|mts|js|cjs|mjs|json)$/.exec(text)) {
								return "Remove Extention from filename (one of : ts|cts|mts|js|cjs|mjs|json)!";
							}
							if (/\.$/.exec(text)) {
								return `Remove last dot. (e.g. '${text.slice(0, -1)}')`;
							}
							return void 0;
						}
					}),
				ext: async ({ results }) => {
					const { type, module } = results;
					const extensionMap: Record<string, Record<string, unknown>> = {
						ts: {
							esm: "mts",
							cjs: "cts"
						},
						js: {
							esm: "mjs",
							cjs: "cjs"
						}
					};

					return type === "json" ? "json" : extensionMap[type as string][module as string];
				},
				finalname: async ({ results }) => `${results.filename}.${results.ext}`,
				outro: async ({ results }) => {
					const { finalname, ext } = results;
					const destination = `${process.cwd()}/${finalname}`;
					const templatePath = path.resolve(__dirname, `./templates/configs/config.${ext}.hbs`);

					if (existsSync(destination)) {
						logging.warn("File already exists!");
						const overwrite = await prompter.confirm({ message: "Overwrite file?", initialValue: false });
						if (prompter.isCancel(overwrite) || !overwrite) {
							prompter.cancel("Dont overwrite file.");
							process.exit(0);
						}
					}

					copyFile(templatePath, destination, (err: unknown): void => {
						if (err) logging.error(err);
					});
					prompter.outro(chalk.bgGreen("File created successfully!"));
				}
			},
			{
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					process.exit(0);
				}
			}
		);
		process.exit(0);
	});

program.parse(process.argv);
