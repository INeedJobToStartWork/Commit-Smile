import { TSelectScheme } from "../components";
import defaultConfig from "../defaultConfig";
import type { TStages } from "../types";
import { TConfirmScheme, TOptionTextZod } from "../types";
import * as z from "zod";

export type TStagesZod = z.ZodType<{
	[key in TStages]: unknown;
}>;

export const promptsSchema = z.object({
	CHANGES: TSelectScheme,
	SCOPES: TSelectScheme,
	BREAKING_CHANGES: TConfirmScheme,
	COMMIT_SHORT: TOptionTextZod,
	COMMIT_DESCRIPTION: TOptionTextZod
}) satisfies TStagesZod;

export const UserPromptsSchema = z.object({
	CHANGES: promptsSchema.shape.CHANGES.default(defaultConfig.prompts.CHANGES),
	SCOPES: promptsSchema.shape.SCOPES.default(defaultConfig.prompts.SCOPES),
	BREAKING_CHANGES: promptsSchema.shape.BREAKING_CHANGES.default(defaultConfig.prompts.BREAKING_CHANGES),
	COMMIT_SHORT: promptsSchema.shape.COMMIT_SHORT.default(defaultConfig.prompts.COMMIT_SHORT),
	COMMIT_DESCRIPTION: promptsSchema.shape.COMMIT_DESCRIPTION.default(defaultConfig.prompts.COMMIT_DESCRIPTION)
});
