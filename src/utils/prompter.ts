import { logging } from ".";
import type { TOptionSelect, TOptionText } from "./types";
import type { ChildProcess } from "child_process";
import consola from "consola";
import type z from "zod";

// export type TPrompterOutput = string | string[];

type TFunctions = () => ChildProcess | unknown;

export class prompter {
	private static LABEL_FOR_CUSTOM = "Write your custom value:";

	static async confirm(label: string, cb?: TFunctions, exitCb?: TFunctions): Promise<boolean> {
		let ans = await consola.prompt(label, { type: "confirm" });
		logging.debug("ODPOWIEDZ TO: ", ans);
		if (ans) {
			logging.debug("TAK");
			if (cb != undefined) {
				logging.debug("CALLBACK ZACZYNA SIE");
				await cb();
			}
			return true;
		}
		if (exitCb) exitCb();
		return false;
	}

	static async select(props: z.input<typeof TOptionSelect>): Promise<string[] | string> {
		const options = [...props.options];
		if (props.isCustom) options.push({ label: "Custom", value: "custom" });

		const userAnswer = (await consola.prompt(props.label, {
			options: options,
			type: props.multiple ? "multiselect" : ("select" as any) //eslint-disable-line
		})) as string[] | string;

		const customHandler = async (): Promise<void> => {
			if (Array.isArray(userAnswer)) {
				do {
					const index = userAnswer.findIndex(item => item == "custom");
					if (index !== -1) userAnswer[index] = await prompter.text({ label: this.LABEL_FOR_CUSTOM });
					else userAnswer.push(await prompter.text({ label: this.LABEL_FOR_CUSTOM }));
				} while (await prompter.confirm("Add another custom value?"));
			}
		};

		if (userAnswer === "custom" || (Array.isArray(userAnswer) && userAnswer.includes("custom"))) await customHandler();
		return userAnswer;
	}

	static async text(props: z.infer<typeof TOptionText>): Promise<string> {
		return consola.prompt(props.label, {
			type: "text"
		});
	}
}
export default prompter;
