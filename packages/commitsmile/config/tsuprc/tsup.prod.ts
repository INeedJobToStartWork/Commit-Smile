import config from "./tsup.base";
import typiaPlug from "@ryoppippi/unplugin-typia/esbuild";
import { copy } from "esbuild-plugin-copy";
import { defineConfig } from "tsup";

export default defineConfig({
	...config,

	dts: true,
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

	noExternal: ["@clack/prompts", "c12", "commander", "jiti", "oh-my-error", "typia", "yaml"],

	format: ["cjs"],
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
});
