import type { TSelectInput } from "@/components";
import type { TConfig } from "@/types";
import type { PartialDeep, RequireAtLeastOne } from "type-fest";
import type { A } from "ts-toolbelt";

//----------------------
// Functions
//----------------------

/**
 * Parse Config to make it easier in configuration for final user
 *
 * Using to this Modules.
 * @param inputConfig
 * @returns parsedConfig (Not validated)
 *
 * @internal @dontexport
 */
export const parseConfig = <T extends PartialDeep<TConfig>>(inputConfig: T): T => {
	let result = inputConfig;
	for (const el of Object.values(parsers)) result = el(result);
	return result;
};

export default parseConfig;

//----------------------
// Modules
//----------------------

/**
 * Type defined for pre-parse config
 * @dontexport
 */
export type TparseSelectOptionsAccept =
	| A.Compute<
			RequireAtLeastOne<{
				label: TSelectInput["options"][number]["label"];
				value: TSelectInput["options"][number]["value"];
			}> &
				TSelectInput["options"][number]
	  >
	| string;

/**
 * Make `TConfig.prompts.stage.options` easier in config!
 *
 * @returns Config with parsed `options`
 * - If option is just a string, {value:string}, and continue below logic.
 * - If option has a value but not a label, label = value
 * - If option has a label but not a value, value = label
 *
 * @internal @dontexport
 */
const parseSelectOptions = <T extends PartialDeep<TConfig>>(inputConfig: T): T => {
	if (!inputConfig.prompts) return inputConfig;

	return {
		...inputConfig,
		prompts: Object.fromEntries(
			Object.entries(inputConfig.prompts).map(([key, element]) => [
				key,
				"options" in element
					? {
							...element,
							options: element.options?.map((option: string | { label?: string; value?: unknown }) =>
								typeof option == "string"
									? { label: option, value: option }
									: { ...option, label: `${option.label || option.value}`, value: option.value || option.label }
							)
						}
					: element
			])
		)
	};
};

/**
 * Array of Parsers run by `parseConfig`
 * @internal @dontexport
 */
const parsers = [parseSelectOptions] as const;
