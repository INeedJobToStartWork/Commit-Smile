import { findConfig, readConfig } from ".";
import type { configSchema } from "@/schema";
import { UserConfigSchema } from "@/schema";
import type z from "zod";

export const getConfiguration = async (configPath: string): Promise<Object & z.output<typeof configSchema>> => {
	const path = await findConfig(configPath);
	if (path) return readConfig(path);

	return UserConfigSchema.parse({});
};

export default getConfiguration;
