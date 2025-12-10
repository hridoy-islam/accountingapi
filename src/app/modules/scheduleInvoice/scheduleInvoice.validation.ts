import { z } from "zod";




const ScheduleInvoiceSchema = z.object({
  body: z.object({
  
    invoiceDate: z.optional(z.coerce.date()),
    invoiceNumber: z.string().optional(),

    status: z.enum(["due", "paid"], { required_error: "Status is required." }),
    transactionType: z.enum(["inflow", "outflow"], { required_error: "Transaction type is required." }),
    amount: z.number({ required_error: "Amount is required." }),

  })
  
});

export const ScheduleInvoiceValidation = {
  ScheduleInvoiceSchema,

};
