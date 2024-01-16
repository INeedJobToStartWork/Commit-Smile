import webpackBaseConfig from "./webpack.base.js";
import { merge } from "webpack-merge";

export default merge(webpackBaseConfig, {
	devtool: "source-map",
	mode: "development",
	name: "development",
	watch: true,
	watchOptions: { ignored: /node_modules/ }
});
