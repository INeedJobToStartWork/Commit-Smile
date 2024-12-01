import { UserPromptsSchema, promptsSchema } from ".";
import defaultConfig from "../defaultConfig";
import { LintMsgSchema, UserLintMsgSchema } from "./lintSchema";
import * as z from "zod";

export const configSchema = z.object({
	prompts: promptsSchema,
	formatter: LintMsgSchema
});

export const UserConfigSchema = z.object({
	prompts: UserPromptsSchema.default(defaultConfig.prompts),
	formatter: UserLintMsgSchema.default(defaultConfig.formatter)
});
