/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @EslintImports/no-unassigned-import
import "@total-typescript/ts-reset";

// TODO: Remove that Eslint ignores

//----------------------
// Types
//----------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TTodo = any;

export type Prettify<T> = object & {
	[K in keyof T]: T[K];
};

type TFunctions<T extends object> = object & (TStages<T> & object);
type TOrder<F extends object> = Prettify<Array<keyof F>>;

type TStages<T extends object> = {
	[K in keyof T]: (arg: {
		functions: Prettify<TFunctions<T>>;
		order: TOrder<TFunctions<T>>;
		results: Prettify<Omit<T, K>>;
	}) => Awaited<T[K]> | Promise<T[K]> | T[K];
};

//----------------------
// Function
//----------------------

// TODO: Better Type Narrowing
export const stageGroup = async <T extends object>(
	stages: TStages<T>,
	options?: { onCancel?: () => void; orderInp?: Array<keyof T> }
) => {
	let results: TTodo = {};
	let functions: TFunctions<T> = { ...stages };
	let order: TOrder<typeof functions> =
		options!.orderInp == void 0 ? (Object.keys(stages) as Array<keyof T>) : options!.orderInp;

	while (order.length) {
		const element = order.shift();

		results[element] = await functions[element]({ results, order, functions });
		if (results[element]?.description == "clack:cancel" && options!.onCancel) options?.onCancel();
	}

	return results;
};

// export const test = async (): Promise<unknown> => {
// 	const result = await stageGroup({
// 		commitMessage: async () => "asd" as const,
// 		useOrder: ({ order }) => order,
// 		useResult: ({ results }) => results,
// 		useFunctions: ({ functions }) => functions,
// 		nextThing: () => "results",
// 		nextThing2: ({ results }): string => `${results.nextThing} + as`,
// 		nextThing3: () => "string",
// 		nextThing4: () => "asd",
// 		nextThing5: ({ functions }) => functions,
// 		nextThing6: ({ results }) => results
// 	});
// 	return result as unknown;
// };
