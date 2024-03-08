import { findConfig, readConfig } from ".";
import { configSchema } from "@/schema";
import type z from "zod";

export const getConfiguration = async (configPath: string): Promise<Object & z.infer<typeof configSchema>> => {
	const path = await findConfig(configPath);
	if (path) return readConfig(path);
	return configSchema.parse({});
};

export default getConfiguration;
