import { TSelectScheme } from "@/components";
import defaultConfig from "@/defaultConfig";
import type { TStages } from "@/types";
import { TConfirmScheme, TOptionTextZod } from "@/types";
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
	CHANGES: TSelectScheme.default(defaultConfig.CHANGES),
	SCOPES: TSelectScheme.default(defaultConfig.SCOPES),
	BREAKING_CHANGES: TConfirmScheme.default(defaultConfig.BREAKING_CHANGES),
	COMMIT_SHORT: TOptionTextZod.default(defaultConfig.COMMIT_SHORT),
	COMMIT_DESCRIPTION: TOptionTextZod.default(defaultConfig.COMMIT_DESCRIPTION)
});
