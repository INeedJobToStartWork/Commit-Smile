import defaultConfig from "@/defaultConfig";
import type { TStages } from "@/types";
import * as z from "zod";

type formatProps = {
	CHANGES: string;
	SCOPES: string[] | string;
	BREAKING_CHANGES: boolean;
	COMMIT_SHORT: string;
};
type formatProps2 = Record<Exclude<TStages, "COMMIT_DESCRIPTION">, string>;

type formatter<T extends Exclude<TStages, "COMMIT_DESCRIPTION"> = Exclude<TStages, "COMMIT_DESCRIPTION">> = {
	[P in T]: {
		before?: string;
		value: (value: formatProps[P]) => string; // Używamy tutaj formatProps[P], aby zapewnić, że typ jest zgodny
		after?: string;
	};
};

export const LintMsgSchema = z.object({
	format: z.function().args(z.custom<formatProps2>()).returns(z.string()),
	formatter: z.custom<formatter>()
	// formatter: z.record(z.custom<Exclude<TStages, "COMMIT_DESCRIPTION">>(), z.object({}))
});
export const UserLintMsgSchema = z.object({
	format: LintMsgSchema.shape.format.default(defaultConfig.formatter.format),
	formatter: LintMsgSchema.shape.formatter.default(defaultConfig.formatter.formatter)
});
