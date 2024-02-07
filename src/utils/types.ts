import defaultConfig from "@/defaultConfig";
import type { multiselect, text, confirm } from "@clack/prompts";
import z from "zod";

export type flatMultipleClack = FlatArray<Parameters<typeof multiselect>, 0>;

const flatMultipleClackZod = z.custom<flatMultipleClack>(() => true);

export type TConfirmFlat = FlatArray<Parameters<typeof confirm>, 0>;
export const TConfirmScheme = z.custom<TConfirmFlat>(() => true);

export const TSelectScheme = z
	.object({
		custom: z.object({
			value: z.boolean(),
			amount: z.number().min(1) // Ask how many times can ask for custom value
		}),
		multiple: z.boolean().default(false)
	})
	.and(flatMultipleClackZod);
export type TSelectInput = z.input<typeof TSelectScheme>;
export type TSelectOutput = z.infer<typeof TSelectScheme>;

export const TOptionTextZod = z.object({}).and(z.custom<FlatArray<Parameters<typeof text>, 0>>(() => true));
export type TOptionTextInput = z.input<typeof TOptionTextZod>;
export type TOptionTextOutput = z.infer<typeof TOptionTextZod>;

export type TStagesZod = z.ZodType<{
	[key in TStages]: unknown;
}>;
export type TStages = "CHANGES" | "COMMIT_DESCRIPTION" | "COMMIT_SHORT" | "SCOPES";

export const configSchema = z.object({
	CHANGES: TSelectScheme,
	SCOPES: TSelectScheme,
	BREAKING_CHANGES: TConfirmScheme,
	COMMIT_SHORT: TOptionTextZod,
	COMMIT_DESCRIPTION: TOptionTextZod
}) satisfies TStagesZod;

export const UserConfigSchema = z.object({
	CHANGES: TSelectScheme.default(defaultConfig.CHANGES),
	SCOPES: TSelectScheme.default(defaultConfig.SCOPES),
	BREAKING_CHANGES: TConfirmScheme.default(defaultConfig.BREAKING_CHANGES),
	COMMIT_SHORT: TOptionTextZod.default(defaultConfig.COMMIT_SHORT),
	COMMIT_DESCRIPTION: TOptionTextZod.default(defaultConfig.COMMIT_DESCRIPTION)
});
export type UserConfig = z.input<typeof UserConfigSchema>;

/**
 * @typedef {TConfig} JSConfig
 */
