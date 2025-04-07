import { z } from "zod";




const pendingTransactionSchema = z.object({
  body: z.object({
  
    invoiceDate: z.coerce.date({ required_error: "Invoice date is required." }),
    invoiceNumber: z.string().optional(),
    status: z.enum(["due", "paid"], { required_error: "Status is required." }),
    transactionType: z.enum(["inflow", "outflow"], { required_error: "Transaction type is required." }),
    amount: z.number({ required_error: "Amount is required." }),
    details: z.string().optional(),
  })
  
});

export const PendingTransactionValidation = {
  pendingTransactionSchema,

};
