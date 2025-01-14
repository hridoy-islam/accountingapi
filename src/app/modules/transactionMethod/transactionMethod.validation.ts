import { z } from "zod";

// Break Schema
const transactionMethodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),

  }),
 
});




export const transactionMethodValidation = {
  transactionMethodSchema,
};
