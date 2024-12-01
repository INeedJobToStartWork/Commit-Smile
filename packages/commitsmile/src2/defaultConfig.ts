import type { configSchema } from "./schema";
import type z from "zod";

export const defaultConfig: z.infer<typeof configSchema> = {
	formatter: {
		format: props => `${props.CHANGES}${props.SCOPES}${props.BREAKING_CHANGES}: ${props.COMMIT_SHORT}`,
		formatter: {
			CHANGES: {
				value: v => v
			},
			SCOPES: {
				value: v => `(${v})`
			},
			COMMIT_SHORT: {
				value: v => v
			},
			BREAKING_CHANGES: {
				value: v => (v ? "!" : "")
			}
		}
	},
	prompts: {
		CHANGES: {
			multiple: false,
			custom: {
				value: false,
				amount: 1
			},
			message: "What type of changes are you making?",
			required: true,
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
		SCOPES: {
			custom: {
				value: true,
				amount: 99
			},
			message: "What is the scope of this change (e.g. component or file name)?",
			multiple: true,
			required: true,
			options: [
				{ label: "🌍 Enviroment", value: "enviroment" },
				{ label: "📖 Docs", value: "docs" },
				{ label: "🌐 Website", value: "web" },
				{ label: "📱 Mobile", value: "mobile" },
				{ label: "🍃 API", value: "api" }
			]
		},
		BREAKING_CHANGES: {
			message: "Are there any breaking changes?",
			active: "Yes",
			inactive: "No",
			initialValue: false
		},
		COMMIT_SHORT: {
			message: "Write short description of commit",
			validate(input: string) {
				if (input.length === 0) return `Value is required!`;
				return void 0;
			}
		},
		COMMIT_DESCRIPTION: {
			message: "Write longer description of commit (optional)"
		}
	}
};

export default defaultConfig;
