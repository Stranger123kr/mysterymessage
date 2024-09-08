import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be three characters" })
  .max(15, { message: "Username less than 15 characters" })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username must not contain special characters",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
