import path from "path";

const __dirname = path.resolve();

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
	target: "node"
};
