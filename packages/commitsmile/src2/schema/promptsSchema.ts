import { TSelectScheme } from "../components";
import defaultConfig from "../defaultConfig";
import type { TStages } from "../types";
import { TConfirmScheme, TOptionTextZod } from "../types";
import * as z from "zod";

export type TStagesZod = z.ZodType<{
	[key in TStages]: unknown;
}>;

export const promptsSchema = z.object({
	type: TSelectScheme,
	scopes: TSelectScheme,
	isBreaking: TConfirmScheme,
	title: TOptionTextZod,
	description: TOptionTextZod
}) satisfies TStagesZod;

export const UserPromptsSchema = z.object({
	type: promptsSchema.shape.type.default(defaultConfig.prompts.type),
	scopes: promptsSchema.shape.scopes.default(defaultConfig.prompts.scopes),
	isBreaking: promptsSchema.shape.isBreaking.default(defaultConfig.prompts.isBreaking),
	title: promptsSchema.shape.title.default(defaultConfig.prompts.title),
	description: promptsSchema.shape.description.default(defaultConfig.prompts.description)
});
