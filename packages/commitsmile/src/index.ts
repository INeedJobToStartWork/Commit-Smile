import "@/cli";
import { program } from "commander";

export type { UserConfig as TConfig } from "@/types";

program.parse(process.argv);
