import { optionDebugger } from "@/helpers";
import * as prompter from "@clack/prompts";
import { program } from "commander";
import { StageRunner } from "@/functions";
import { exit } from "node:process";
import { logging } from "@/utils";
import { select } from "@/components";
import chalk from "chalk";
import { copyFile, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

program
	.command("init")
	.description("Init configuration file")
	.addOption(optionDebugger)
	.action(async () => {
		const test = await new StageRunner()
			.addStep({
				intro: () => {
					prompter.intro(chalk.bgMagenta("Init your config file!"));
				}
			})
			.addStep({
				type: async () =>
					select({
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
					})
			})
			.addStep({
				module: async ({ results }) =>
					results.type === "json"
						? void 0
						: select({
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
							})
			})
			.addStep({
				filename: async () =>
					prompter.text({
						message: "Enter filename (without ext):",
						initialValue: "commitSmile",
						defaultValue: "commitSmile",
						validate(text) {
							if (/\.(ts|cts|mts|js|cjs|mjs|json)$/u.test(text)) {
								return "Remove Extention from filename (one of : ts|cts|mts|js|cjs|mjs|json)!";
							}
							if (text.endsWith(".")) {
								return `Remove last dot. (e.g. '${text.slice(0, -1)}')`;
							}
							return void 0;
						}
					})
			})
			.addStep({
				ext: ({ results }) => {
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

					return type === "json" ? "json" : extensionMap[type][module!];
				}
			})
			.addStep({ finalname: ({ results }) => `${results.filename as string}.${results.ext}` })
			.addStep({
				outro: async ({ results }) => {
					const { finalname, ext } = results;
					const destination = `${process.cwd()}/${finalname}`;
					const templatePath = path.resolve(
						dirname(fileURLToPath(import.meta.url)),
						`./templates/configs/config.${ext}.hbs`
					);

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
			})
			.execute({
				onCancel: () => {
					prompter.cancel("Operation cancelled.");
					exit(0);
				}
			});
		logging.debug(test);

		process.exit(0);
	});
