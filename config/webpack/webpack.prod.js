import webpackBaseConfig from "./webpack.base.js";
import { merge } from "webpack-merge";

export default merge(webpackBaseConfig, {
  mode: "production",
  name: "production",
  optimization: {
    mangleExports: true,

    minimize: true,
    providedExports: true,
    usedExports: true
  }
});
