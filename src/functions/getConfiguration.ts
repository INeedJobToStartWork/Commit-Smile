import { findConfig, readConfig } from ".";
import { UserConfigSchema } from "@/utils/types";
import type z from "zod";

export const getConfiguration = async (configPath: string): Promise<Object & z.infer<typeof UserConfigSchema>> => {
	const path = await findConfig(configPath);
	if (path) return readConfig(path);
	return UserConfigSchema.parse({});
};

export default getConfiguration;
