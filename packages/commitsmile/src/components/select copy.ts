/* eslint-disable no-await-in-loop */
/* eslint-disable require-atomic-updates */
import { multiselect, select as cSelect, text, confirm } from "@clack/prompts";
import type { tags } from "typia";

export type TSelectInput = FlatArray<Parameters<typeof multiselect>, 0> & {
	custom: {
		amount: tags.Default<1> & tags.Minimum<1> & number;
		value: tags.Default<false> & boolean;
	};
	multiple: tags.Default<false> & boolean;
};

export const select = async (props: TSelectInput): Promise<TSelectInput["options"][number]["value"]> => {
	const LABEL_FOR_CUSTOM = "Write your custom value:";

	const compo = props.multiple ? multiselect : cSelect;
	// eslint-disable-next-line @EslintPrefArrayFunc/prefer-array-from
	const options = [...props.options];

	if (props.custom.value) options.push({ label: "Custom", value: "custom" });

	let result = await compo({
		...props,
		message: props.message,
		options: options
	});

	const customHandler = async (): Promise<void> => {
		if (Array.isArray(result)) {
			const index = result.findIndex(item => item == "custom");
			if (index >= 0) result[index] = await text({ message: LABEL_FOR_CUSTOM });
			while (await confirm({ message: "Do you want to add more custom values?" })) {
				result.push(await text({ message: LABEL_FOR_CUSTOM }));
			}
		} else result = await text({ message: LABEL_FOR_CUSTOM });
	};
	if (result === "custom" || (Array.isArray(result) && result.includes("custom"))) await customHandler();

	return result;
};

export default select;
