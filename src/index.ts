import def from "../package.json";
import { select } from "./components";
import { getConfiguration } from "@/functions";
import { logging } from "@/utils";
import * as prompter from "@clack/prompts";
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
// 		logging.info("Init your config file!");

// 		const defaultTemp: Record<string, { filename: string; path: string }> = {
// 			ts: { filename: "commitSmile.ts", path: path.join(import.meta.url, "./templates/configs/config.ts.hbs") },
// 			js: { filename: "commitSmile.json", path: path.join(path.resolve(), "../templates/configs/config.js.hbs") },
// 			json: { filename: "commitSmile.json", path: path.join(process.cwd(), "../templates/configs/config.json.hbs") }
// 		};
// 		const answers = {} as Record<string, string | undefined>;

// 		answers.ext = (await prompter.select({
// 			message: "Choose config template:",
// 			options: [
// 				{ label: "🟦 Typescript", value: "ts", hint: "Default" },
// 				{ label: "🟨 Javascript", value: "js" },
// 				{ label: "{} JSON", value: "json" }
// 			]
// 		})) as string;
// 		answers.module =
// 			answers.ext != "json"
// 				? ((await prompter.select({
// 						label: "Choose module type:",
// 						options: [
// 							{ label: "EcmaScript", value: "esm", hint: "default - import/export" },
// 							{ label: "CommonJS", value: "commonjs", hint: "require/module.exports" }
// 						]
// 					})) as string)
// 				: undefined;
// 		answers.fileName = (await prompter.text({
// 			message: "Choose file name:",
// 			placeholder: `${defaultTemp[answers.ext].filename}`,
// 			default: `${defaultTemp[answers.ext].filename}`
// 		})) as string;

// 		// await copyFileSync(defaultTemp[answers.ext].path, `${import.meta.url}/${answers.fileName}`, 1);
// 	});

program.parse(process.argv);
