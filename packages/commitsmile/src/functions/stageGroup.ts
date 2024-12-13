/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Prettify, TStages } from "@/types";
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

export class StageGroup<TResults extends Record<string, any> = object> {
	public results: TResults = {} as TResults;
	public order: string[] = [];
	public instructions: Record<string, (context: BaseContext<TResults>) => any> = {};

	addInstruction<TKey extends string, TFunc extends (context: BaseContext<TResults>) => any>(
		instruction?: Record<TKey, TFunc>
	): StageGroup<Record<TKey, ExtractReturnType<TFunc>> & TResults> {
		if (instruction == void 0) return this as StageGroup<Record<TKey, ExtractReturnType<TFunc>> & TResults>;
		const key = Object.keys(instruction)[0] as TKey;

		this.instructions[key] = instruction[key];
		this.order.push(key);

		return this as StageGroup<Record<TKey, ExtractReturnType<TFunc>> & TResults>;
	}

	async execute(options?: { onCancel?: () => void }): Promise<TResults> {
		while (this.order.length) {
			const element = this.order.shift() as TStages;
			const context: BaseContext<TResults> = {
				results: this.results,
				order: this.order,
				instructions: this.instructions
			};

			(this.results as any)[element] = await this.instructions[element](context);

			if (this.results[element]?.description == "clack:cancel" && options?.onCancel) options.onCancel();
		}

		return this.results;
	}
}
