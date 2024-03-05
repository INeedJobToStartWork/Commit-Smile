import config from "./tsup.base";
import { copy } from "esbuild-plugin-copy";
import { defineConfig } from "tsup";

export default defineConfig({
	...config,
	splitting: true,
	minify: true,
	shims: true,
	outDir: "dist",

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
		})
	]
});
