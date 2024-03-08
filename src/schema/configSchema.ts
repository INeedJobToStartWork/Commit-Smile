import { UserPromptsSchema } from "@/schema";
import * as z from "zod";

export const configSchema = z.object({}).and(UserPromptsSchema);
