import { Option } from "commander";

//----------------------
// Types
//----------------------

/** @internal @dontexport */
export type TOptionsDebugger = { debugger: boolean };

//----------------------
// Helper
//----------------------

/** @internal @dontexport */
export const optionDebugger = new Option("-D, --debugger", "Debugger mode").default(false);

export default optionDebugger;
