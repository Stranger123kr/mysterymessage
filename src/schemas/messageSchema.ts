import { z } from "zod";

export const acceptMessageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content mush be at least of 10 character" })
    .max(300, { message: "Content mush be no longer than 300 character" }),
});
