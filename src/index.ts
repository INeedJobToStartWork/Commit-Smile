import { version as PACKAGE_VERSION } from "../package.json";
import type { TStages } from "./utils/types";
import { findConfig, readConfig } from "@/functions";
import { logging } from "@/utils";
import { spawn } from "child_process";
import { program } from "commander";
import consola from "consola";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());

program.version(PACKAGE_VERSION);

const agreePrompt = async (label: string, cb: Function, exitFail = false): Promise<void> => {
	if (!exitFail && (await consola.prompt(label, { type: "confirm" }))) await cb();
	if (!(await consola.prompt(label, { type: "confirm" }))) return process.exit(0);
	await cb();
};

// if (!(await consola.prompt("Every change it's fine?", { type: "confirm" }))) return process.exit(0);
// await spawn("git", ["commit", "-m", commit, "-m", ANSWERS.COMMIT_DESCRIPTION ? ANSWERS.COMMIT_DESCRIPTION : ""], {
//   stdio: "inherit"
// });
// if (await consola.prompt("Push it? 🚀", { type: "confirm" })) await spawn("git", ["push"], { stdio: "inherit" });

program
	.option("-C, --config <relativePath>", "path to config", EXECUTED_PATH)
	.option("-D, --debugger", "Debugger mode", false)
	.action(async (options: { debugger: boolean; config: string }) => {
		process.env.DEBUG = options.debugger ? "TRUE" : "FALSE";

		logging.debug("Debug mode enabled");
		logging.debug("Options: ", options);

		const config = await readConfig(await findConfig(options.config));

		const ORDEROFTASK: TStages[] = ["CHANGES", "SCOPES", "COMMIT_SHORT", "COMMIT_DESCRIPTION"] as const;

		let ANSWERS: Partial<Record<TStages, string>> = {};

		for (const orderTask of ORDEROFTASK) {
			const task = config[orderTask];
			const { label, ...rest } = task;

			if ("isCustom" in task && "options" in rest && Array.isArray(rest.options)) {
				rest.options.push({ label: "Custom", value: "custom" });
			}

			ANSWERS[orderTask] = (await consola.prompt(label, {
				...rest,
				type: "options" in rest && Array.isArray(rest.options) ? "select" : "text"
			})) as string;

			logging.debug("ANSWERS: ", ANSWERS);
			if (ANSWERS[orderTask] == "custom") {
				ANSWERS[orderTask] = await consola.prompt("Write your Custom value", { type: "text" });
			}
		}

		const commit = `${ANSWERS.CHANGES}(${ANSWERS.SCOPES}): ${ANSWERS.COMMIT_SHORT}`;
		logging.info(commit);

		await agreePrompt(
			"Every change it's fine?",
			() => {
				spawn("git", ["commit", "-m", commit, "-m", ANSWERS.COMMIT_DESCRIPTION ? ANSWERS.COMMIT_DESCRIPTION : ""], {
					stdio: "inherit"
				});
			},
			true
		);
		await agreePrompt("🚀Push it?", () => {
			spawn("git", ["push"], {
				stdio: "inherit"
			});
		});

		return process.exit(0);
	});

program.parse(process.argv);
