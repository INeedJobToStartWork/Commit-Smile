import webpackBaseConfig from "./webpack.base.js";
import bundle from "bundle-declarations-webpack-plugin";
import { merge } from "webpack-merge";

export default merge(webpackBaseConfig, {
	mode: "production",
	name: "production",
	optimization: {
		mangleExports: true,

		minimize: true,
		providedExports: true,
		usedExports: true
	},
	plugins: [
		new bundle.BundleDeclarationsWebpackPlugin({
			entry: {
				filePath: "./src/utils/types.ts",
				libraries: {
					inlinedLibraries: ["zod", "@"]
				}
			},
			outFile: "main.d.ts",
			compilationOptions: {},
			removeEmptyLines: false,
			removeEmptyExports: false
		})
	]
});
