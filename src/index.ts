import { version as PACKAGE_VERSION } from "../package.json";
import type { TStages } from "./utils/types";
import { getConfiguration } from "@/functions";
import { logging, prompter } from "@/utils";
import { spawnSync } from "child_process";
import { program } from "commander";
// import { copyFileSync } from "fs";
import path from "path";

export * from "@/utils/types";

const EXECUTED_PATH = path.join(path.resolve());

program.version(PACKAGE_VERSION);

program
	.description("Execute Commit Smile application")
	.option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
	.option("-D, --debugger", "Debugger mode", false)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await getConfiguration(options.config);

		const Answers = {
			CHANGES: await prompter.select(config.CHANGES),
			SCOPES: await prompter.select(config.SCOPES),
			COMMIT_SHORT: await prompter.text(config.COMMIT_SHORT),
			COMMIT_DESCRIPTION: (await prompter.text(config.COMMIT_DESCRIPTION)) satisfies string
		} as const satisfies Partial<Record<TStages, unknown>>;

		const commit = `${Answers.CHANGES}(${Answers.SCOPES ? Answers.SCOPES : ""}): ${Answers.COMMIT_SHORT}`;
		logging.info(commit);
		await prompter.confirm(
			"Is this commit valid?",
			false,
			() => {
				spawnSync(`git commit -m "${commit}"`, {
					shell: true,
					stdio: "inherit"
				});
			},
			() => process.exit(1)
		);

		return process.exit(0);
	});

program
	.command("init")
	.description("Init configuration file")
	.action(async () => {
		logging.info("Init your config file!");

		const defaultTemp: Record<string, { filename: string; path: string }> = {
			ts: { filename: "commitSmile.ts", path: path.join(import.meta.url, "./templates/configs/config.ts.hbs") },
			js: { filename: "commitSmile.json", path: path.join(path.resolve(), "../templates/configs/config.js.hbs") },
			json: { filename: "commitSmile.json", path: path.join(process.cwd(), "../templates/configs/config.json.hbs") }
		};
		const answers = {} as Record<string, string | undefined>;

		answers.ext = (await prompter.select({
			label: "Choose config template:",
			options: [
				{ label: "🟦 Typescript", value: "ts", hint: "Default" },
				{ label: "🟨 Javascript", value: "js" },
				{ label: "{} JSON", value: "json" }
			]
		})) as string;
		answers.module =
			answers.ext != "json"
				? ((await prompter.select({
						label: "Choose module type:",
						options: [
							{ label: "EcmaScript", value: "esm", hint: "default - import/export" },
							{ label: "CommonJS", value: "commonjs", hint: "require/module.exports" }
						]
					})) as string)
				: undefined;
		answers.fileName = (await prompter.text({
			label: "Choose file name:",
			placeholder: `${defaultTemp[answers.ext].filename}`,
			default: `${defaultTemp[answers.ext].filename}`
		})) as string;

		// await copyFileSync(defaultTemp[answers.ext].path, `${import.meta.url}/${answers.fileName}`, 1);
	});

program.parse(process.argv);
