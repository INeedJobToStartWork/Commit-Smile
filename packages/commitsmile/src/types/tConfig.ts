import type { TSelectInput } from "@/components";
import type { TparseSelectOptionsAccept } from "@/functions";
import type { text, confirm } from "@clack/prompts";
import type { A } from "ts-toolbelt";
import type { OmitDeep, PartialDeep } from "type-fest";

export type TOptionText = FlatArray<Parameters<typeof text>, 0>;
export type TConfirmFlat = FlatArray<Parameters<typeof confirm>, 0>;
export const Stages = ["description", "isBreaking", "scopes", "title", "type"] as const;
export type TStages = (typeof Stages)[number];

type formatterProps = {
	/** Indicates if the commit contains breaking changes */
	isBreaking?: boolean;
	/** Affected scopes of the commit (e.g., components, modules) */
	scopes?: string[] | string;
	/** Main commit message title */
	title?: string;
	/** Type of the commit (e.g., feat, fix, chore) */
	type?: string;
};

/**
 * Required props for the final commit message format.
 * All properties are required in the final formatting step.
 */
type formatProps = {
	/** Formatted breaking change indicator */
	isBreaking: string;
	/** Formatted scope(s) of the changes */
	scopes: string[] | string;
	/** Formatted commit title */
	title: string;
	/** Formatted commit type */
	type: string;
};

/**
 * Formatter functions for each commit message component.
 * Excludes description as it's handled separately.
 * @template T - Stage type (excluding description)
 */
type formatter<T extends Exclude<TStages, "description"> = Exclude<TStages, "description">> = {
	[P in T]: (value: formatterProps[P]) => string;
};

/**
 * Configuration type definition for the `commitsmile` package.
 *
 * Defines the structure and formatting rules for commit messages.
 * @author commitsmile
 */
export type TConfig = {
	/**
	 * Final commands to execute after the 'isCorrect' stage, in the order of object keys.
	 *
	 *
	 * Accepts strings or functions.
	 * @example @default
	 * {
	 *   gitAdd: "git add .",
	 *   commit: (results) => `git commit -m '${results.format()}' ${results.commitDescription ? `-m "${results.commitDescription}"` : ''}`
	 * }
	 *
	 */
	finalCommands?: Record<
		string,
		| string
		| ((results: {
				// eslint-disable-next-line @typescript-eslint/ban-types
				description?: "editor" | (string & {});
				format: () => string;
				isBreaking?: string;
				scopes?: string;
				title?: string;
				type?: string;
		  }) => string)
	>;
	/** Part of Config responsible for commit format. */
	formatter: formatter & {
		/**
		 * Final format of commit.
		 * @param props - Object containing all formatted commit parts (changes, scopes, breaking changes, etc.)
		 * @returns A formatted commit message string
		 *
		 * @example
		 * ```typescript
		 * format: props => `${props.type}${props.scopes}${props.isBreaking}: ${props.title}`,
		 * ```
		 */
		format: (props: formatProps) => string;
	};
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		/** Prompt about longer description of commit */
		description?:
			| TOptionText
			| string
			| false
			| { always: "editor" }
			| (TOptionText & { always: "inline" })
			| (TOptionText & { always?: "editor" | "inline" });

		/** Prompt about "Changes is breaking backward compatibility?" */
		isBreaking?: TConfirmFlat | false;
		/** Prompt about scopes that changes affect */
		scopes?:
			| TSelectInput
			| false
			| {
					message: TSelectInput["message"];
					/** If true, will find workspaces and add as options to select */
					workspaces: true;
			  }
			| (TSelectInput & {
					/** If true, will find workspaces and add as options to select */
					workspaces: boolean;
			  });
		/** Prompt about title of commit */
		title?: TOptionText | false;
		/** Prompt about type of changes */
		type?: TSelectInput | false;
	};
	// settings?: {
	// 	AI?: boolean;
	// };
};

/**
 * Pre-Parse Configuration type definition for the `commitsmile` package.
 *
 * Defines the structure and formatting rules for commit messages.
 * @author commitsmile
 */
export type TparseOptionsCon = Array<A.Compute<TparseSelectOptionsAccept, "deep">>;

/**
 * Input configuration type with partial requirements.
 * Allows for more flexible configuration input with optional properties.
 */
export type TConfigInput = OmitDeep<PartialDeep<TConfig>, "prompts.scopes"> & {
	/** Part of Config responsible for Commit Stages. */
	prompts?: {
		description?: PartialDeep<TConfig["prompts"]["description"] | string>;
		isBreaking?: PartialDeep<TConfig["prompts"]["isBreaking"] | string>;
		scopes?: PartialDeep<TConfig["prompts"]["scopes"] & { options: TparseOptionsCon }>;
		title?: PartialDeep<TConfig["prompts"]["title"] & { options: TparseOptionsCon }> | string;
		type?: PartialDeep<TConfig["prompts"]["type"] & { options: TparseOptionsCon }>;
	};
};
