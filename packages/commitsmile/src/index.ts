import "@/cli";
import { program } from "commander";

program.parse(process.argv);

export { defaultConfig } from "@/defaultConfig";
export type { TConfigInput } from "@/types";
