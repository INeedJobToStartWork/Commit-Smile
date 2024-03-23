import { Option } from "commander";
import path from "path";

const EXECUTED_PATH = path.join(path.resolve());
export const optionConfig = new Option("-C, --config <relativePath>", "path to config").default(EXECUTED_PATH);
export default optionConfig;
