import { configSchema } from "@/utils/types";
import jiti from "jiti";
import type z from "zod";

export const readConfig = async (configPath: string): Promise<z.infer<object & typeof configSchema>> => {
	let result = (await jiti(process.cwd(), {
		cache: true,
		debug: process.env.DEBUG === "TRUE"
	})(configPath)) as Record<string, unknown>;

	let parsed = Object.hasOwn(result, "default") ? result.default : result;

	return configSchema.parse(parsed);
};

export default readConfig;
