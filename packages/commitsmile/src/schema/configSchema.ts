import { LintMsgSchema, UserLintMsgSchema } from "./lintSchema";
import defaultConfig from "@/defaultConfig";
import { UserPromptsSchema, promptsSchema } from "@/schema";
import * as z from "zod";

export const configSchema = z.object({
	prompts: promptsSchema,
	formatter: LintMsgSchema
});

export const UserConfigSchema = z.object({
	prompts: UserPromptsSchema.default(defaultConfig.prompts),
	formatter: UserLintMsgSchema.default(defaultConfig.formatter)
});
