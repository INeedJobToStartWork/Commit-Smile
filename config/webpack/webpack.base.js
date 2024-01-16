import CopyPlugin from "copy-webpack-plugin";
import path from "path";

const __dirname = path.resolve();
const PATHOUT = path.resolve(__dirname, "lib");

export default {
	entry: {
		index: path.resolve(__dirname, "src/index.ts")
	},

	module: {
		rules: [
			{
				exclude: "/\\node_modules\\[^\\]+$/gusm",
				test: /\.(ts|mts)$/,
				use: {
					loader: "swc-loader"
				}
			}
		]
	},

	name: "base",
	output: {
		clean: true,
		filename: "[name].cjs",
		path: path.resolve(__dirname, "lib"),
		chunkLoading: false,
		library: {
			type: "commonjs2",
			export: "default"
		}
	},
	resolve: {
		extensions: ["", ".ts", ".js", ".mjs", ".mts"],
		alias: {
			"@": path.resolve(__dirname, "src/")
		}
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, "./src/templates"), to: path.join(PATHOUT, "templates") }]
		})
	],
	target: "node"
};
