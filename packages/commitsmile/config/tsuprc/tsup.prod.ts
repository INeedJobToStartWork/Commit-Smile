import config from "./tsup.base";
import typiaPlug from "@ryoppippi/unplugin-typia/esbuild";
import { copy } from "esbuild-plugin-copy";
import { defineConfig } from "tsup";

export default defineConfig([
	{
		...config,
		entry: ["src/index.ts"],

		splitting: false,
		minify: true,
		shims: true,

		bundle: true,

		minifyIdentifiers: true,
		minifySyntax: true,
		minifyWhitespace: true,

		metafile: false,
		treeshake: true,

		outDir: "dist",
		external: ["node:stream", "@types/node"],
		noExternal: ["@clack/prompts", "c12", "commander", "oh-my-error", "typia", "yaml"],

		format: ["cjs", "esm"],

		esbuildPlugins: [
			copy({
				assets: [
					{ from: "./package.json", to: "./package.json" },
					{ from: "./.npmrc", to: "./.npmrc" },
					{ from: "./.npmignore", to: "./.npmignore" },
					{ from: "./README.md", to: "./README.md" },
					{ from: "./src/templates/configs/*", to: "./templates/configs" }
				]
			}),
			typiaPlug({ tsconfig: "./tsconfig.json", cache: false })
		]
	},
	{
		entry: ["src/index.ts"],
		dts: {
			entry: "./src/index.ts",
			resolve: true,
			only: true
		},
		format: ["esm", "cjs"],
		external: ["node:stream"]
	},
	{
		...config,
		entry: ["src/bin/app.ts"],
		splitting: true,
		minify: true,
		shims: true,

		bundle: true,

		minifyIdentifiers: true,
		minifySyntax: true,
		minifyWhitespace: true,

		metafile: false,
		treeshake: true,

		outDir: "dist/bin",

		noExternal: ["@clack/prompts", "c12", "commander", "oh-my-error", "typia", "yaml"],
		// noExternal: ["@clack/prompts", "commander", "oh-my-error", "typia", "jiti"],
		format: ["esm"],
		esbuildPlugins: [typiaPlug({ tsconfig: "./tsconfig.json", cache: false })]
	}
]);
