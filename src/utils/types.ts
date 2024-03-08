import defaultConfig from "@/defaultConfig";
import type { multiselect, text, confirm } from "@clack/prompts";
import type { infer as zinfer, ZodType, input } from "zod";
import { boolean, custom, number, object } from "zod";

// Global types

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

// Config types - TS & ZOD

// prompts atom & modules types
export type flatMultipleClack = FlatArray<Parameters<typeof multiselect>, 0>;

const flatMultipleClackZod = custom<flatMultipleClack>(() => true);

export type TConfirmFlat = FlatArray<Parameters<typeof confirm>, 0>;
export const TConfirmScheme = custom<TConfirmFlat>(() => true);

export const TSelectScheme = object({
	custom: object({
		value: boolean(),
		amount: number().min(1) // Ask how many times can ask for custom value
	}),
	multiple: boolean().default(false)
}).and(flatMultipleClackZod);
export type TSelectInput = input<typeof TSelectScheme>;
export type TSelectOutput = zinfer<typeof TSelectScheme>;

export const TOptionTextZod = object({}).and(custom<FlatArray<Parameters<typeof text>, 0>>(() => true));
export type TOptionTextInput = input<typeof TOptionTextZod>;
export type TOptionTextOutput = zinfer<typeof TOptionTextZod>;

export type TStagesZod = ZodType<{
	[key in TStages]: unknown;
}>;
export type TStages = "BREAKING_CHANGES" | "CHANGES" | "COMMIT_DESCRIPTION" | "COMMIT_SHORT" | "SCOPES";

// prompts config

export const configSchema = object({
	CHANGES: TSelectScheme,
	SCOPES: TSelectScheme,
	BREAKING_CHANGES: TConfirmScheme,
	COMMIT_SHORT: TOptionTextZod,
	COMMIT_DESCRIPTION: TOptionTextZod
}) satisfies TStagesZod;

export const UserConfigSchema = object({
	CHANGES: TSelectScheme.default(defaultConfig.CHANGES),
	SCOPES: TSelectScheme.default(defaultConfig.SCOPES),
	BREAKING_CHANGES: TConfirmScheme.default(defaultConfig.BREAKING_CHANGES),
	COMMIT_SHORT: TOptionTextZod.default(defaultConfig.COMMIT_SHORT),
	COMMIT_DESCRIPTION: TOptionTextZod.default(defaultConfig.COMMIT_DESCRIPTION)
});
export type UserConfig = input<typeof UserConfigSchema>;

/**
 * @typedef {TConfig} JSConfig
 */
