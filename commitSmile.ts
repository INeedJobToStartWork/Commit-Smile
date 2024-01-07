// import defaultConfig from "./defaultConfig";
import type { configSchema } from "@/utils/types";
import type z from "zod";

export const Config: z.input<typeof configSchema> = {
	// sCOPES: {
	//   label: defaultConfig.SCOPES.label,
	//   options: [
	//     { label: "🌍 Enviroment", value: "enviroment" },
	//     { label: "🤖 Discord Bot", value: "discord-bot" },
	//     { label: "📖 Docs", value: "docs" },
	//     { label: "📦 Package", value: "package" },
	//     { label: "📕 Storybook", value: "Storybook" },
	//     { label: "🔧 Config", value: "config" }
	//   ]
	// }
};

export default Config;
