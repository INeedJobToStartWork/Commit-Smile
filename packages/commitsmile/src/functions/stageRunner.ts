/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Prettify, TStages } from "@/types";
import { logging } from "@/utils";
// eslint-disable-next-line @EslintImports/no-unassigned-import
import "@total-typescript/ts-reset";

// TODO: Remove that Eslint ignores

//----------------------
// Types
//----------------------

type TFunctions<T extends object> = object & (TStages2<T> & object);
type TOrder<F extends object> = Prettify<Array<keyof F>>;

type TStages2<T extends object> = {
	[K in keyof T]: (arg: {
		functions: Prettify<TFunctions<T>>;
		order: TOrder<TFunctions<T>>;
		results: Prettify<Omit<T, K>>;
	}) => Awaited<T[K]> | Promise<T[K]> | T[K];
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ExtractReturnType<T> = T extends (...args: any[]) => any ? UnwrapPromise<ReturnType<T>> : never;

type BaseContext<TResults> = {
	instructions: Record<string, any>;
	order: string[];
	results: TResults;
};

//----------------------
// Function
//----------------------

/**
 * Pipeline
 * @description Represents a group of stages that can be executed sequentially with results accumulation.
 *
 * @typeParam TResults - Type of the results object that stores the output of each stage.
 *                      Defaults to an empty object if not specified.
 */
export class StageRunner<TResults extends Record<string, any> = object> {
	/** Store the results of executed steps */
	public results: TResults = {} as TResults;
	/** Order of steps execution */
	public order: string[] = [];
	/** Store Steps functions */
	public steps: Record<string, (context: BaseContext<TResults>) => any> = {};

	/**
	 * Adds a new step to the execution sequence
	 *
	 * @param instruction - Object containing a single step function with its identifier
	 * @returns Updated StageRunner instance with new step's type information
	 *
	 * @example
	 * ```typescript
	 * const Answers = new StageRunner()
	 *   .addStep({ 'askAge': async (context) => ({ isValid: true })});
	 * ```
	 */
	addStep<TKey extends string, TFunc extends (context: BaseContext<TResults>) => any>(
		instruction?: Record<TKey, TFunc>
	): StageRunner<Record<TKey, ExtractReturnType<TFunc>> & TResults> {
		if (instruction == void 0) return this as StageRunner<Record<TKey, ExtractReturnType<TFunc>> & TResults>;
		// const key = Object.keys(instruction)[0] as TKey;
		const key = Object.keys(instruction)[0] as TKey;

		this.steps[key] = instruction[key];
		this.order.push(key);

		return this as StageRunner<Record<TKey, ExtractReturnType<TFunc>> & TResults>;
	}

	/**
	 * Executes all steps in defined order (needed to work, use at the end).
	 *
	 * @param options - Execution configuration
	 * @param options.onCancel - Callback triggered when a step returns "clack:cancel"
	 * @returns Promise resolving to accumulated results
	 *
	 * @example
	 * ```typescript
	 * const results = await runner.execute({
	 *   onCancel: () => console.log('Execution cancelled')
	 * });
	 * ```
	 */
	async execute(options?: { onCancel?: () => void }): Promise<TResults> {
		while (this.order.length) {
			const element = this.order.shift() as TStages;
			const context: BaseContext<TResults> = {
				results: this.results,
				order: this.order,
				instructions: this.steps
			};
			logging.debug({ results: this.results, order: this.order });
			(this.results as any)[element] = await this.steps[element](context);

			if (this.results[element]?.description == "clack:cancel" && options?.onCancel) options.onCancel();
		}

		return this.results;
	}
}
