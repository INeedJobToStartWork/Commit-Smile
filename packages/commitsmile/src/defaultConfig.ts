/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { TConfig, TConfigInput } from "@/types";
import { deepMerge, logging } from "@/utils";
import { myError, myErrorWrapper } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";

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
// Types (Molecular &Organism)
//----------------------

/**
 * Props Type for `defaultConfig`
 */
type TDefaultConfigProps<Parsed extends boolean = false> = {
	/**
	 * If false, emojis are removed from the default config
	 * @default true
	 */
	emoji: Parsed extends true ? Temoji : Temoji | boolean;
	/** If false, final commands are removed from config. @default { remove:["gitPush"]}  */
	finalCommands:
		| boolean
		| {
				//TODO: Change that in future for better Typed but still full flexible
				/** Remove object keys from finalCommands default config  @default ["gitPush"]*/
				remove: string[];
		  };
};
//----------------------
// Types (Atoms)
//----------------------
/** @dontexport */
type Temoji = {
	/**
	 * If false, emojis are removed from labels at prompts.
	 * @default true
	 */
	label: boolean;
	/**
	 * If false, emojis are removed from passed values.
	 * @default true
	 */
	value: boolean;
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
const configData = (configOptions?: TDefaultConfigProps): TConfig => {
	logging.debug(configOptions);
	const validatedConfigOptions = myErrorWrapper(parseConfigOptions, myError(MyErrorList.WRONG_CONFIG))(configOptions);

	const getStringIfTrue = (condition: boolean, str: string) => (condition ? str : "");
	const getFinalCommands = (defaultSettings: TConfig["finalCommands"]): TConfig["finalCommands"] => {
		if (defaultSettings == void 0) return {};
		if (typeof validatedConfigOptions.finalCommands == "boolean") {
			return validatedConfigOptions.finalCommands ? defaultSettings : {};
		}

		let result = defaultSettings;

		for (const el of validatedConfigOptions.finalCommands.remove) delete result[el];

		return result;
	};
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
			COMMIT_DESCRIPTION: { always: "editor" }
			// COMMIT_DESCRIPTION: {
			// 	message: "Write longer description of commit (optional)"
			// }
		},
		finalCommands: getFinalCommands({
			gitAdd: "git add .",
			commit: Answers => {
				if (Answers.COMMIT_DESCRIPTION == "editor") {
					return `git commit ${getStringIfTrue(Boolean(Answers.COMMIT_DESCRIPTION), "-e")} -m "${Answers.format()}"`;
				}
				// eslint-disable-next-line @EslintSonar/no-nested-template-literals
				return `git commit -m "${Answers.format()}" ${getStringIfTrue(Boolean(Answers.COMMIT_DESCRIPTION), `-m "${Answers.COMMIT_DESCRIPTION}"`)}`;
			},
			gitPush: "git push"
		})
	} as const satisfies TConfig;
};

//----------------------
// Config Helper
//----------------------

/**
 * Parser of `configOptions` at `configData`
 * @internal @dontexport
 */
const parseConfigOptions = (configOptions?: Parameters<typeof configData>[0]): TDefaultConfigProps<true> => {
	const defaultOptions = { emoji: true, finalCommands: { remove: ["gitPush"] } };
	let result = configOptions ? deepMerge(configOptions, defaultOptions) : defaultOptions;

	// Parse Emoji
	if (typeof result.emoji == "boolean") {
		result.emoji = { label: result.emoji, value: result.emoji };
	}

	// TODO: Fix it - remove as
	return result as unknown as TDefaultConfigProps<true>;
};
