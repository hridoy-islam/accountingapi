import { z } from "zod";

const companySchema = z.object({
  body: z.object({
    companyName: z.string().nonempty({ message: "Company name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
    companyAddress: z.string().nonempty({ message: "Company address is required" }),
    assignUser: z.array(z.string()).optional(),
    logo: z.string().nullable().optional()
  }),
}); // Ensures no extra fields are present

export const companyValidation = {
  companySchema,
};
