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
	isBreaking?: boolean;
	scopes?: string[] | string;
	title?: string;
	type?: string;
};

type formatProps = {
	isBreaking: string;
	scopes: string[] | string;
	title: string;
	type: string;
};

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
	 *   commit: (results) => "git commit -m '${results.format()}' ${results.commitDescription ? '-m "${results.commitDescription}"' : ''}"
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
	formatter: {
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
		/** Formatters responsible to transform input for every stage */
		formatter: formatter;
	};
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		description?:
			| TOptionText
			| string
			| false
			| { always: "editor" }
			| (TOptionText & { always: "inline" })
			| (TOptionText & { always?: "editor" | "inline" });
		isBreaking?: TConfirmFlat | false;
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

		title?: TOptionText | false;
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
export type TConfigInput = OmitDeep<PartialDeep<TConfig>, "prompts.scopes"> & {
	/** Part of Config responsible for Commit Stages. */
	prompts: {
		description?: PartialDeep<TConfig["prompts"]["description"]> | string;
		isBreaking?: PartialDeep<TConfig["prompts"]["isBreaking"]> | string;
		scopes?: PartialDeep<TConfig["prompts"]["scopes"]> & { options: TparseOptionsCon };
		title?: string | (PartialDeep<TConfig["prompts"]["title"]> & { options: TparseOptionsCon });
		type?: PartialDeep<TConfig["prompts"]["type"]> & { options: TparseOptionsCon };
	};
};
