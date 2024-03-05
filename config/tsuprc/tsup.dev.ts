import config from "./tsup.base";
import { defineConfig } from "tsup";

export default defineConfig({
	...config,
	outDir: "lib",
	watch: ["src"]
});
