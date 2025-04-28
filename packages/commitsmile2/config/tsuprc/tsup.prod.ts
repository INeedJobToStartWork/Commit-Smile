import { defineConfig } from "tsup";
import { prodConfigs } from "./tsup.base";
import { PROD_OPTIMIZE } from "./internals";

//----------------------
// Functions
//----------------------

export default defineConfig([
	{
		...prodConfigs.METAFILES_TO_COPY,
		clean: true
	},
	{
		...prodConfigs.CLI_APP,
		...PROD_OPTIMIZE
	},
	{
		...prodConfigs.PACKAGE,
		...PROD_OPTIMIZE,
		format: ["esm", "cjs"],
		dts: true
	}
]);
