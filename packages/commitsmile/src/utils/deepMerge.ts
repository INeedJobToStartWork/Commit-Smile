/* eslint-disable guard-for-in */

//----------------------
// Functions
//----------------------
// export const deepMerge = <T extends U & object, U extends object>(primaryObject?: T, defaultObject?: U) => {
/**
 * Deep merge two objects recursively.
 * @description Combines two objects, with primary object taking precedence. Handles nested objects but not arrays.
 *
 * @param primaryObject - The main object whose values take precedence
 * @param defaultObject - The fallback object with default values
 * @returns A new merged object combining both inputs
 *
 * @example
 * ```typescript
 * const primary = { a: 1, b: { x: 2 } };
 * const defaults = { a: 0, b: { y: 3 }, c: 4 };
 * deepMerge(primary, defaults);
 * // Result: { a: 1, b: { x: 2, y: 3 }, c: 4 }
 * ```
 */

export const deepMerge = <T>(primaryObject: T, defaultObject: T): T => {
	if (primaryObject == void 0) return defaultObject;
	if (defaultObject == void 0) return primaryObject;
	if (typeof primaryObject !== "object" || typeof defaultObject !== "object") return primaryObject;

	const result = { ...primaryObject };

	for (const key in defaultObject) {
		if (!(key in result)) {
			result[key] = defaultObject[key];
			continue;
		}

		if (
			typeof defaultObject[key] === "object" &&
			typeof result[key] === "object" &&
			!Array.isArray(defaultObject[key]) &&
			!Array.isArray(result[key])
		) {
			result[key] = deepMerge(result[key], defaultObject[key]);
		}
	}

	return result;
};

export default deepMerge;
