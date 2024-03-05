import "@/cli";
import { program } from "commander";

export type { UserConfig as TConfig } from "@/utils/types";

program.parse(process.argv);
