import type { TSelectInput } from "@/utils/types";
import { multiselect, select as cSelect, text, confirm } from "@clack/prompts";

export const select = async (props: TSelectInput): Promise<unknown> => {
	const LABEL_FOR_CUSTOM = "Write your custom value:";
	const { message } = props;
	const compo = props.multiple ? multiselect : cSelect;
	const options = [...props.options];

	if (props.custom.value) options.push({ label: "Custom", value: "custom" });

	let result = await compo({
		...props,
		message: message,
		options: [...options]
	});

	const customHandler = async (): Promise<void> => {
		if (Array.isArray(result)) {
			const index = result.findIndex(item => item == "custom");
			if (index >= 0) result[index] = await text({ message: LABEL_FOR_CUSTOM });
			while (await confirm({ message: "Do you want to add more custom values?" })) {
				result.push(await text({ message: LABEL_FOR_CUSTOM }));
			}
		} else {
			result = await text({ message: LABEL_FOR_CUSTOM });
		}
	};
	if (result === "custom" || (Array.isArray(result) && result.includes("custom"))) await customHandler();

	return result;
};
// Dodac mozliwosc wiecej custom elementow

export default select;
