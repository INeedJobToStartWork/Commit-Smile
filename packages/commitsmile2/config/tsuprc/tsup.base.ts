import { defineConfig } from "tsup";
import copy from "esbuild-plugin-copy";
import { addNodeRequireShim } from "./internals";

//----------------------
// Functions
//----------------------

/** @internal */
export const BasicConfig = (isDev: boolean) =>
	({
		METAFILES_TO_COPY: isDev
			? {}
			: {
					entry: ["src/index.ts"],
					esbuildPlugins: [
						copy({
							assets: [
								{ from: "./package.json", to: "./package.json" },
								{ from: "./.npmrc", to: "./.npmrc" },
								{ from: "./.npmignore", to: "./.npmignore" },
								{ from: "./README.md", to: "./README.md" }
								// { from: "./src/templates/configs/*", to: "./templates/configs" }
							]
						})
					]
				},
		CLI_APP: {
			entry: ["src/bin/app.ts"],
			outDir: `${isDev ? "lib" : "dist"}/bin`,
			target: "esnext",
			banner: addNodeRequireShim,
			watch: isDev ? ["src"] : false
		},
		PACKAGE: {
			entry: ["src/index.ts"],
			outDir: isDev ? "lib" : "dist",
			target: "es2020",
			banner: addNodeRequireShim,
			watch: isDev ? ["src"] : false
		}
	}) as const satisfies Record<string, Parameters<typeof defineConfig>[number]>;

/** @internal */
export const devConfigs = BasicConfig(true);

/** @internal */
export const prodConfigs = BasicConfig(false);

export default BasicConfig;
