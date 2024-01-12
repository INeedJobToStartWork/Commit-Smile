import type { configSchema } from "./types";
import { TOptionText, TOptionSelect } from "./types";
import type z from "zod";

export { TOptionText, TOptionSelect };
export type config = z.input<typeof configSchema>;
