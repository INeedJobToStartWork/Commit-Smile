/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { TConfig } from "@/types";
import { deepMerge, logging } from "@/utils";
import { myError, myErrorWrapper } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";
import { is } from "typia";

//----------------------
// MyError
//----------------------

const MyErrorList = {
	WRONG_CONFIG: {
		name: "Wrong Config",
		code: "WRONG_CONFIG",
		message: "Configuration is incorrect",
		hint: "Please check your configuration settings."
	}
} as const satisfies TMyErrorList<IMyError>;

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
	emoji:
		| boolean
		| {
				/**
				 * If false, emojis are removed from labels at prompts.
				 * @defaultValue true
				 */
				label: boolean;
				/**
				 * If false, emojis are removed from passed values.
				 * @defaultValue true
				 */
				value: boolean;
		  };
};

//----------------------
// Functions
//----------------------

class ConfigPromise<T extends TConfig> extends Promise<T> {
	async deepMerge(obj: TConfig) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return this.then((data: TConfig) => deepMerge<Partial<TConfig>>(obj, data));
	}
}

/**
 * Default `commitsmile` config generator! :)
 * @param configOptions
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, @typescript-eslint/explicit-module-boundary-types
export const defaultConfig = (configOptions?: TDefaultConfigProps) =>
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
const configData = (configOptions: TDefaultConfigProps = { emoji: true }): TConfig => {
	logging.debug(configOptions);
	const validatedConfigOptions = myErrorWrapper(() => {
		let result: TDefaultConfigProps = configOptions;
		if (typeof configOptions.emoji == "boolean") {
			result = { emoji: { label: configOptions.emoji, value: configOptions.emoji } };
		}
		type toParse = { emoji: { label: boolean; value: boolean } };
		if (!is<toParse>(result)) logging.error(`Not this type! ${result}`);
		return result as toParse;
	}, myError(MyErrorList.WRONG_CONFIG))();

	return {
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
						label: `${validatedConfigOptions.emoji.label && "🎉 "}Feat`,
						value: `${validatedConfigOptions.emoji.value && "🎉 "}Feat`
					},
					{
						hint: "A bug fix",
						label: `${validatedConfigOptions.emoji.label && "🐛 "}Fix`,
						value: `${validatedConfigOptions.emoji.value && "🐛 "}Fix`
					},

					{
						hint: "Documentation only changes",
						label: `${validatedConfigOptions.emoji.label && "📖 "}Docs`,
						value: `${validatedConfigOptions.emoji.value && "📖 "}Docs`
					},
					{
						hint: "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
						label: `${validatedConfigOptions.emoji.label && "🎨 "}Style`,
						value: `${validatedConfigOptions.emoji.value && "🎨 "}Style`
					},
					{
						hint: "Changes that affect the build system or external dependencies",
						label: `${validatedConfigOptions.emoji.label && "♻️  "}Refactor`,
						value: `${validatedConfigOptions.emoji.value && "♻️  "}Refactor`
					},
					{
						hint: "A code change that improves performance",
						label: `${validatedConfigOptions.emoji.label && "🏎️  "}Perf`,
						value: `${validatedConfigOptions.emoji.value && "🏎️  "}Perf`
					},
					{
						hint: "Adding missing tests or correcting existing tests",
						label: `${validatedConfigOptions.emoji.label && "🧪 "}Test`,
						value: `${validatedConfigOptions.emoji.value && "🧪 "}Test`
					},
					{
						hint: "Changes to the build process or auxiliary tools and libraries such as documentation generation",
						label: `${validatedConfigOptions.emoji.label && "⚙️  "}Chore`,
						value: `${validatedConfigOptions.emoji.value && "⚙️  "}Chore`
					}
				]
			},
			SCOPES: {
				custom: 99,
				message: "What is the scope of this change (e.g. component or file name)?",
				multiple: true,
				required: true,
				options: [
					{ label: `${validatedConfigOptions.emoji.label && "🌍"}  Enviroment`, value: "enviroment" },
					{ label: `${validatedConfigOptions.emoji.label && "📖"}  Docs`, value: "docs" },
					{ label: `${validatedConfigOptions.emoji.label && "🌐"}  Website`, value: "web" },
					{ label: `${validatedConfigOptions.emoji.label && "📱"}  Mobile`, value: "mobile" },
					{ label: `${validatedConfigOptions.emoji.label && "🍃"} API`, value: "api" }
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
	} as const;
};
