/* eslint-disable no-await-in-loop */
/* eslint-disable require-atomic-updates */
import { multiselect, select as cSelect, text, confirm } from "@clack/prompts";
import type { tags } from "typia";



//----------------------
// Functions
//----------------------

export type TSelectInput = FlatArray<Parameters<typeof multiselect>, 0> & {
	/**
	 *  How many custom values can be choosed?
	 *  @default undefined
	 */
	custom: number | undefined;
	/**
	 * Allow to have multiple choice.
	 */
	multiple: boolean;
};

/**
* Interactive CLI Select with custom Options.
* @description Select `select` or `multiselect` from `@clack/prompts` with option for custom user input.
* 
* @param props - Configuration object for the select input
* @returns Selected value(s) - single value or array based on multiple flag
* 
* @example
* ```typescript
* const result = await select({
*   message: "Choose options:",
*   options: [
*     { label: "Option 1", value: "1" },
*     { label: "Option 2", value: "2" }
*   ],
*   multiple: true,
*   custom: true
* });
* ```
*/
export const select = async (props: TSelectInput) => {
	const LABEL_FOR_CUSTOM = "Write your custom value:";
	const compo = props.multiple ? multiselect : cSelect;

	const options = [...props.options, ...(props.custom ? [{ label: "Custom", value: "custom" }] : [])];

	let result = await compo({
		...props,
		message: props.message,
		options
	});

	

	// const customHandler = async (): Promise<void> => {
	// 	if (Array.isArray(result)) {
	// 		const index = result.findIndex(item => item == "custom");
	// 		if (index >= 0) result[index] = await text({ message: LABEL_FOR_CUSTOM });
	// 		while (await confirm({ message: "Do you want to add more custom values?" })) {
	// 			result.push(await text({ message: LABEL_FOR_CUSTOM }));
	// 		}
	// 	} else result = await text({ message: LABEL_FOR_CUSTOM });
	// };
	// if (result === "custom" || (Array.isArray(result) && result.includes("custom"))) await customHandler();

	// return result;
};

export default select;
