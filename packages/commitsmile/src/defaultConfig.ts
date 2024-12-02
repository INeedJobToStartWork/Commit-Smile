
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { TConfig } from "@/types";
import { deepMerge } from "@/utils";

//----------------------
// Types
//----------------------
/**
 *
 */
type TDefaultConfigProps = {
	/**
	 * If false, emojis are removed from the default config
	 * @defaultValue true
	 */
	emoji: boolean | { label: boolean; value: boolean };
};

//----------------------
// Functions
//----------------------

class ConfigPromise extends Promise {
	// eslint-disable-next-line no-undef
	[x: string]: any;
	deepMerge(obj: TConfig) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return this.then((data: TConfig) => deepMerge<Partial<TConfig>>(obj, data));
	}
}

/**
 * Default `commitsmile` config generator! :)
 * @param configOptions
 * @returns
 */
export const defaultConfig = (configOptions: TDefaultConfigProps) =>
	new ConfigPromise((resolve: any) => {
		const defaultData = configData(configOptions);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		resolve(defaultData);
	});

export default defaultConfig;

//----------------------
// Config
//----------------------

/** @dontexport */
const configData = (configOptions: TDefaultConfigProps = { emoji: true }): TConfig =>
	({
		formatter: {
			format: props => `${props.CHANGES}${props.SCOPES}${props.BREAKING_CHANGES}: ${props.COMMIT_SHORT}`,
			formatter: {
				CHANGES: v => v,
				SCOPES: v => `(${v})`,
				COMMIT_SHORT: v => v,
				BREAKING_CHANGES: v => `${v && "!"}`
			}
		},
		prompts: {
			CHANGES: {
				multiple: false,
				message: "What type of changes are you making?",
				required: true,
				options: [
					{
						hint: "A new feature for the user, not a new feature for build script",
						label: `${configOptions.emoji && "🎉 "}Feat`,
						value: `${configOptions.emoji && "🎉 "}Feat`
					},
					{
						hint: "A bug fix",
						label: `${configOptions.emoji && "🐛 "}Fix`,
						value: `${configOptions.emoji && "🐛 "}Fix`
					},

					{
						hint: "Documentation only changes",
						label: `${configOptions.emoji && "📖 "}Docs`,
						value: `${configOptions.emoji && "📖 "}Docs`
					},
					{
						hint: "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
						label: `${configOptions.emoji && "🎨 "}Style`,
						value: `${configOptions.emoji && "🎨 "}Style`
					},
					{
						hint: "Changes that affect the build system or external dependencies",
						label: `${configOptions.emoji && "♻️  "}Refactor`,
						value: `${configOptions.emoji && "♻️  "}Refactor`
					},
					{
						hint: "A code change that improves performance",
						label: `${configOptions.emoji && "🏎️  "}Perf`,
						value: `${configOptions.emoji && "🏎️  "}Perf`
					},
					{
						hint: "Adding missing tests or correcting existing tests",
						label: `${configOptions.emoji && "🧪 "}Test`,
						value: `${configOptions.emoji && "🧪 "}Test`
					},
					{
						hint: "Changes to the build process or auxiliary tools and libraries such as documentation generation",
						label: `${configOptions.emoji && "⚙️  "}Chore`,
						value: `${configOptions.emoji && "⚙️  "}Chore`
					}
				]
			},
			SCOPES: {
				custom: 99,
				message: "What is the scope of this change (e.g. component or file name)?",
				multiple: true,
				required: true,
				options: [
					{ label: `${configOptions.emoji && "🌍"}  Enviroment`, value: "enviroment" },
					{ label: `${configOptions.emoji && "📖"}  Docs`, value: "docs" },
					{ label: `${configOptions.emoji && "🌐"}  Website`, value: "web" },
					{ label: `${configOptions.emoji && "📱"}  Mobile`, value: "mobile" },
					{ label: `${configOptions.emoji && "🍃"} API`, value: "api" }
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
	}) as const;
