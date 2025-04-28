import { defineConfig } from "tsup";

//----------------------
// Internals
//----------------------

/**
 * Basic optimization/minification settings for the bundler
 * @internal
 */
export const PROD_OPTIMIZE = {
	splitting: false,
	minify: true,
	shims: true,

	bundle: true,

	minifyIdentifiers: true,
	minifySyntax: true,
	minifyWhitespace: true,

	metafile: false,
	treeshake: true
} as const satisfies Parameters<typeof defineConfig>[number];

//TODO: FIX TYPE
/**
 * Adds a Node.js require shim for ESM modules
 * This fixes dynamic imports by creating a require function
 * using Node's module.createRequire() for ESM compatibility
 * @internal
 */
export const addNodeRequireShim = ({ format }: Parameters<typeof defineConfig>[number]["banner"]) => {
	if (format === "esm") {
		const banner = `
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
		`;

		return { js: banner };
	}
};
