import defaultConfig from "../defaultConfig";
import type { TStages } from "../types";
import * as z from "zod";

type formatProps = {
	type: string;
	scopes: string[] | string;
	isBreaking: boolean;
	title: string;
};
type formatProps2 = Record<Exclude<TStages, "description">, string>;

type formatter<T extends Exclude<TStages, "description"> = Exclude<TStages, "description">> = {
	[P in T]: {
		before?: string;
		value: (value: formatProps[P]) => string; // Używamy tutaj formatProps[P], aby zapewnić, że typ jest zgodny
		after?: string;
	};
};

export const LintMsgSchema = z.object({
	format: z.function().args(z.custom<formatProps2>()).returns(z.string()),
	formatter: z.custom<formatter>()
	// formatter: z.record(z.custom<Exclude<TStages, "description">>(), z.object({}))
});
export const UserLintMsgSchema = z.object({
	format: LintMsgSchema.shape.format.default(defaultConfig.formatter.format),
	formatter: LintMsgSchema.shape.formatter.default(defaultConfig.formatter.formatter)
});
