import { copy } from "esbuild-plugin-copy";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],

	clean: true,
	format: ["cjs", "esm"],
	esbuildPlugins: [copy({ assets: [{ from: "./src/templates/configs/*", to: "./templates/configs" }] })]
});
