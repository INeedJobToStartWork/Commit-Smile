import { UserConfigSchema } from "@/utils/types";
import jiti from "jiti";
import type z from "zod";

export const readConfig = async (configPath: string): Promise<z.infer<object & typeof UserConfigSchema>> => {
	let result = (await jiti(process.cwd(), {
		cache: true,
		debug: process.env.DEBUG === "TRUE"
	})(configPath)) as Record<string, unknown>;

	let parsed = Object.hasOwn(result, "default") ? result.default : result;

	return UserConfigSchema.parse(parsed);
};

export default readConfig;
