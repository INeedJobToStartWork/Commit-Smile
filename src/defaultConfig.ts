import type { CommitSmileConfSchema } from "@/utils/types";
import type z from "zod";

export const defaultConfig: z.input<typeof CommitSmileConfSchema> = {
	CHANGES: {
		label: "What changes are you making?",
		options: [
			{
				hint: "A new feature for the user, not a new feature for build script",
				label: "🎉 Feat",
				value: "🎉 Feat"
			},
			{
				hint: "A bug fix",
				label: "🐛 Fix",
				value: "🐛 Fix"
			},

			{
				hint: "Documentation only changes",
				label: "📖 Docs",
				value: "📖 Docs"
			},
			{
				hint: "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
				label: "🎨 Style",
				value: "🎨 Style"
			},
			{
				hint: "Changes that affect the build system or external dependencies",
				label: "♻️  Refactor",
				value: "♻️  Refactor"
			},
			{
				hint: "A code change that improves performance",
				label: "🏎️  perf",
				value: "🏎️  perf"
			},
			{
				hint: "Adding missing tests or correcting existing tests",
				label: "🧪 Test",
				value: "🧪 Test"
			},
			{
				hint: "Changes to the build process or auxiliary tools and libraries such as documentation generation",
				label: "⚙️  Chore",
				value: "⚙️  Chore"
			}
		]
	},
	COMMIT_DESCRIPTION: {
		default: "",
		label: "Write longer description of commit (optional)",
		placeholder: ""
	},
	COMMIT_SHORT: {
		label: "Write short description of commit",
		placeholder: "Commit will..."
	},
	SCOPES: {
		isCustom: true,
		label: "What is the scope of this change (e.g. component or file name)? (press enter to skip)",
		multiple: true,
		options: [
			{ label: "🌍 Enviroment", value: "enviroment" },
			{ label: "📖 Docs", value: "docs" },
			{ label: "🌐 Website", value: "api" },
			{ label: "📱 Mobile", value: "mobile" },
			{ label: "🍃 API", value: "api" }
		]
	}
} as const;

export default defaultConfig;
