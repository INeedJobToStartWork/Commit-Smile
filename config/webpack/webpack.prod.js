import webpackBaseConfig from "./webpack.base.js";
import bundle from "bundle-declarations-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { merge } from "webpack-merge";

const __dirname = path.resolve();
const PATHOUT = path.resolve(__dirname, "dist");

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
				filePath: "./src/utils/typesExp.ts"
			},
			outFile: "index.d.ts",
			compilationOptions: {},
			removeEmptyLines: false,
			removeEmptyExports: false
		}),
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, "README.md"), to: PATHOUT },
				{ from: path.resolve(__dirname, "package.json"), to: PATHOUT }
			]
		})
	],
	output: {
		path: PATHOUT
	}
});
