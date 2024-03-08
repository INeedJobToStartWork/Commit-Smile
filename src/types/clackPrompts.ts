import type { multiselect, confirm, text } from "@clack/prompts";
import * as z from "zod";

export type flatMultipleClack = FlatArray<Parameters<typeof multiselect>, 0>;
export const flatMultipleClackZod = z.custom<flatMultipleClack>(() => true);

export type TConfirmFlat = FlatArray<Parameters<typeof confirm>, 0>;
export const TConfirmScheme = z.custom<TConfirmFlat>(() => true);

export const TOptionTextZod = z.object({}).and(z.custom<FlatArray<Parameters<typeof text>, 0>>(() => true));

export type TOptionTextInput = z.input<typeof TOptionTextZod>;
export type TOptionTextOutput = z.infer<typeof TOptionTextZod>;
