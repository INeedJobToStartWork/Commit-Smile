/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { TConfig, TConfigInput } from "@/types";
import { deepMerge, logging } from "@/utils";
import { myError, myErrorWrapper } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";
import { is } from "typia";

//----------------------
// MyError
//----------------------
/** @internal @dontexport */
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
 * Props Type for `defaultConfig`
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
	async deepMerge(obj: TConfigInput) {
		// TODO: remove that as, but before that fix deepMerge
		return this.then((data: TConfig) => deepMerge<TConfigInput>(obj, data as TConfigInput));
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

	const getStringIfTrue = (condition: boolean, str: string) => (condition ? str : "");

	return {
		formatter: {
			format: props => `${props.CHANGES}${props.SCOPES}${props.BREAKING_CHANGES}: ${props.COMMIT_SHORT}`,
			formatter: {
				CHANGES: v => v,
				SCOPES: v => `(${v})`,
				COMMIT_SHORT: v => v,
				BREAKING_CHANGES: v => (v ? "!" : "")
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
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🎉 ")}Feat`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "🎉 ")}Feat`
					},
					{
						hint: "A bug fix",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🐛 ")}Fix`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "🐛 ")}Fix`
					},

					{
						hint: "Documentation only changes",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "📖 ")}Docs`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "📖 ")}Docs`
					},
					{
						hint: "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🎨 ")}Style`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "🎨 ")}Style`
					},
					{
						hint: "Changes that affect the build system or external dependencies",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "♻️  ")}Refactor`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "♻️  ")}Refactor`
					},
					{
						hint: "A code change that improves performance",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🏎️  ")}Perf`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "🏎️  ")}Perf`
					},
					{
						hint: "Adding missing tests or correcting existing tests",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🧪 ")}Test`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "🧪 ")}Test`
					},
					{
						hint: "Changes to the build process or auxiliary tools and libraries such as documentation generation",
						label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "⚙️  ")}Chore`,
						value: `${getStringIfTrue(validatedConfigOptions.emoji.value, "⚙️  ")}Chore`
					}
				]
			},
			SCOPES: {
				custom: 99,
				message: "What is the scope of this change (e.g. component or file name)?",
				multiple: true,
				required: true,
				options: [
					{ label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🌍")}  Enviroment`, value: "enviroment" },
					{ label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "📖")}  Docs`, value: "docs" },
					{ label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🌐")}  Website`, value: "web" },
					{ label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "📱")}  Mobile`, value: "mobile" },
					{ label: `${getStringIfTrue(validatedConfigOptions.emoji.label, "🍃")} API`, value: "api" }
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
		},
		finalCommands: {
			gitAdd: "git add .",
			commit: Answers =>
				`git commit -m "${Answers.commit}" ${Answers.commitDescription ? `-m "${Answers.commitDescription}"` : ""}`
		}
	} as const satisfies TConfig;
};
