import type { TSelectInput } from "@/components";
import type { TparseSelectOptionsAccept } from "@/functions";
import type { text, confirm } from "@clack/prompts";
import type { A } from "ts-toolbelt";
import type { OmitDeep, PartialDeep } from "type-fest";

export type TOptionText = FlatArray<Parameters<typeof text>, 0>;
export type TConfirmFlat = FlatArray<Parameters<typeof confirm>, 0>;
export type TStages = "BREAKING_CHANGES" | "CHANGES" | "COMMIT_DESCRIPTION" | "COMMIT_SHORT" | "SCOPES";

type formatterProps = {
	BREAKING_CHANGES: boolean;
	CHANGES: string;
	COMMIT_SHORT: string;
	SCOPES: string[] | string;
};

type formatProps = {
	BREAKING_CHANGES: string;
	CHANGES: string;
	COMMIT_SHORT: string;
	SCOPES: string[] | string;
};

type formatter<T extends Exclude<TStages, "COMMIT_DESCRIPTION"> = Exclude<TStages, "COMMIT_DESCRIPTION">> = {
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
	 *   commit: (results) => "git commit -m '${results.format()}' ${results.commitDescription ? '-m "${results.commitDescription}"' : ''}"
	 * }
	 */
	finalCommands?: Record<
		string,
		| string
		| ((results: {
				BREAKING_CHANGES: string;
				CHANGES: string;
				// eslint-disable-next-line @typescript-eslint/ban-types
				COMMIT_DESCRIPTION: "editor" | (string & {}) | undefined;
				COMMIT_SHORT: string;
				SCOPES: string;
				format: () => string;
		  }) => string)
	>;
	/** Part of Config responsible for commit format. */
	formatter: {
		/**
		 * Final format of commit.
		 * @param props - Object containing all formatted commit parts (changes, scopes, breaking changes, etc.)
		 * @returns A formatted commit message string
		 *
		 * @example
		 * ```typescript
		 * format: props => `${props.CHANGES}${props.SCOPES}${props.BREAKING_CHANGES}: ${props.COMMIT_SHORT}`,
		 * ```
		 */
		format: (props: formatProps) => string;
		/** Formatters responsible to transform input for every stage */
		formatter: formatter;
	};
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		BREAKING_CHANGES: TConfirmFlat;
		CHANGES: TSelectInput;
		COMMIT_DESCRIPTION:
			| { always: "editor" | "skip" }
			| (TOptionText & { always: "inline" })
			| (TOptionText & { always?: "editor" | "inline" | "skip" });

		COMMIT_SHORT: TOptionText;
		SCOPES: TSelectInput;
	};
};

/**
 * Pre-Parse Configuration type definition for the `commitsmile` package.
 *
 * Defines the structure and formatting rules for commit messages.
 * @author commitsmile
 */
export type TConfigInput = OmitDeep<PartialDeep<TConfig>, "prompts.CHANGES.options" | "prompts.SCOPES.options"> & {
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		CHANGES?: { options: Array<A.Compute<TparseSelectOptionsAccept, "deep">> };
		SCOPES?: { options: Array<A.Compute<TparseSelectOptionsAccept, "deep">> };
	};
};
