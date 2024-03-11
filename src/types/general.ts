import type { UserConfigSchema } from "@/schema";
import type * as z from "zod";

// Global types
export type Prettify<T> = object & {
	[K in keyof T]: T[K];
};

export type TStages = "BREAKING_CHANGES" | "CHANGES" | "COMMIT_DESCRIPTION" | "COMMIT_SHORT" | "SCOPES";

// prompts config

export type UserConfig = z.input<typeof UserConfigSchema>;

/**
 * @typedef {TConfig} JSConfig
 */
