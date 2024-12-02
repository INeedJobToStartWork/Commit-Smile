import type { TSelectInput } from "@/components";
import type { text, confirm } from "@clack/prompts";

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
}

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
		format: (props: formatProps ) => string;
		/** Formatters responsible to transform input for every stage */
		formatter: formatter;
	};
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		BREAKING_CHANGES: TConfirmFlat;
		CHANGES: TSelectInput;
		COMMIT_DESCRIPTION: TOptionText;
		COMMIT_SHORT: TOptionText;
		SCOPES: TSelectInput;
	};
};

