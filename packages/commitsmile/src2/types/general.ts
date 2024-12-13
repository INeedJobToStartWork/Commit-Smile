import type { UserConfigSchema } from "../schema";
import type * as z from "zod";

// Global types
export type Prettify<T> = object & {
	[K in keyof T]: T[K];
};

export type TStages = "isBreaking" | "type" | "description" | "title" | "scopes";

// prompts config

export type UserConfig = z.input<typeof UserConfigSchema>;

/**
 * @typedef {TConfig} JSConfig
 */
