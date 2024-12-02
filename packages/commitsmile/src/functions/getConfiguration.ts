import { findConfig } from "@/functions";
import type { TConfig } from "@/types";
import { loadConfig } from "c12";
import { logging } from "@/utils";
import type { IMyError, TDetails, TMyErrorList } from "oh-my-error";
import { is, validate } from "typia";
import { exit } from "node:process";
import defaultConfig from "@/defaultConfig";

//----------------------
// MyError
//----------------------

/** @internal @dontexport */
const MyErrorList = {
	WRONG_FORMAT: {
		code: "WRONG_FORMAT",
		name: "Wrong format",
		message: "Your config format is wrong",
		hint: (el: ReturnType<typeof validate>["errors"][number]) =>
			`At path ${el.path.replace("$input", "config")} we expected ${el.expected} but got ${el.value}`,
		details: (e: unknown) => e
	}
} as const satisfies TMyErrorList<IMyError & TDetails>;

//----------------------
// Functions
//----------------------

/**
 * Find, Read and Parse config
 *
 * @param pathInput - Path to config
 * @returns config object (parsed)
 * @throws If file not found or wrong config format
 *
 * @internal @dontexport
 */
export const getConfiguration = async (pathInput = "./"): Promise<TConfig> => {
	const configPath = findConfig(pathInput);
	const nameFile = "commitsmile";

	const config = await (async () => {
		let { config } = await loadConfig<TConfig>({
			name: nameFile,
			configFile: configPath ?? undefined,
			packageJson: true
		});

		return Object.keys(config).length == 0 ? defaultConfig() : config;
	})();

	if (!is<TConfig>(config)) {
		logging.error(`${MyErrorList.WRONG_FORMAT.name}: ${MyErrorList.WRONG_FORMAT.message}`);
		const errors = validate<TConfig>(config).errors;
		logging.error(errors);
		// for (const error of errors) logging.error(myError(MyErrorList.WRONG_FORMAT, { hint: [error] }).hint);
		exit(1);
	}
	logging.debug(config);

	return config;
};

export default getConfiguration;
