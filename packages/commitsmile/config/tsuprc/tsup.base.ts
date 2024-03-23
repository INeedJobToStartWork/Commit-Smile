import { copy } from "esbuild-plugin-copy";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	target: "es2020",
	clean: true,
	format: ["esm"],
	esbuildPlugins: [copy({ assets: [{ from: "./src/templates/configs/*", to: "./templates/configs" }] })]
});
