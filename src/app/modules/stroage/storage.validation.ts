import { z } from "zod";



const storageSchema = z.object({
  body: z.object({
    storageName: z.string({ required_error: "Storage name is required." }),
    openingBalance: z.number({ required_error: "Opening balance is required." }).default(0),
    openingDate: z.string({ required_error: "Opening date is required." }).transform((str) => new Date(str)),
    logo: z.string().optional(),
    status: z.boolean({ required_error: "Status is required." }).default(true),
    auditStatus: z.boolean({ required_error: "Audit status is required." }).default(true),
  }),
});

export const storageValidation = {
 storageSchema,
};
