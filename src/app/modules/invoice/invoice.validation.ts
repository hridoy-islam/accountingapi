import { z } from "zod";




const invoiceSchema = z.object({
  body: z.object({
    billedFrom: z.string({ required_error: "Billed from is required." }),
    billedTo: z.string({ required_error: "Billed to is required." }),
    invoiceDate: z.coerce.date({ required_error: "Invoice date is required." }),
    invoiceNumber: z.string().optional(),
    description: z.string({ required_error: "Description is required." }),
    status: z.enum(["due", "paid"], { required_error: "Status is required." }),
    transactionType: z.enum(["inflow", "outflow"], { required_error: "Transaction type is required." }),
    amount: z.number({ required_error: "Amount is required." }),
    details: z.string().optional(),
  })
  
});

export const invoiceValidation = {
  invoiceSchema,

};
