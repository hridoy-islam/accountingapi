import { z } from "zod";
import { UserStatus } from "./user.constant";

const userValidationSchema = z.object({
  pasword: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .max(20, { message: "Password can not be more than 20 characters" })
    .optional(),
  otpExpiry: z
    .string({ required_error: "Otp expiry date is required." })
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
  otp: z.string().nullable().optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
