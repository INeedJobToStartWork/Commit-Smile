import path from "path";

const __dirname = path.resolve();

export default {
	entry: {
		index: path.resolve(__dirname, "src/index.ts"),
		readme: path.resolve(__dirname, "readme.md")
	},

	module: {
		rules: [
			{
				exclude: "/\\node_modules\\[^\\]+$/gusm",
				test: /\.(ts|mts)$/,
				use: {
					loader: "swc-loader"
				}
			},
			{
				exclude: "/\\node_modules\\[^\\]+$/gusm",
				test: /\.(json|md)$/i,
				type: "javascript/auto",
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]"
						}
					}
				]
			}
		]
	},

	name: "base",
	output: {
		clean: true,
		filename: "[name].cjs",
		path: path.resolve(__dirname, "lib"),
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
