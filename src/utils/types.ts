import defaultConfig from "@/defaultConfig";
import z from "zod";

export const TOptionSelect = z.object({
	isCustom: z.boolean().default(false),
	label: z.string(),
	multiple: z.boolean().default(false),
	options: z
		.union([
			z.string(),
			z.object({
				hint: z.string().optional(),
				label: z.string().min(2).max(20),
				value: z.string()
			})
		])
		.array()
		.nonempty()
	// .optional()
});

export const TOptionText = z.object({
	default: z.string().optional(),
	initial: z.string().optional(),
	label: z.string(),
	placeholder: z.string().optional()
});

export const CommitSmileConfSchema = z.object({
	CHANGES: TOptionSelect,
	COMMIT_DESCRIPTION: TOptionText,
	COMMIT_SHORT: TOptionText,
	SCOPES: TOptionSelect
});

export const configSchema = z.object({
	CHANGES: TOptionSelect.default(defaultConfig.CHANGES),
	COMMIT_DESCRIPTION: TOptionText.default(defaultConfig.COMMIT_DESCRIPTION),
	COMMIT_SHORT: TOptionText.default(defaultConfig.COMMIT_SHORT),
	SCOPES: TOptionSelect.default(defaultConfig.SCOPES)
});

export type TStages = "CHANGES" | "COMMIT_DESCRIPTION" | "COMMIT_SHORT" | "SCOPES";
