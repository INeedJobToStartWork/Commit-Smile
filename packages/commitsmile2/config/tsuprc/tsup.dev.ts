import { defineConfig } from "tsup";
import { devConfigs } from "./tsup.base";

//----------------------
// Functions
//----------------------

export default defineConfig(Object.values(devConfigs));
