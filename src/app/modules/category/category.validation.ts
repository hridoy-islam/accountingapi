import { z } from "zod";

const categorySchema = z.object({
  body: z.object({
    categoryName: z.string().nonempty({ message: "categoryName is required" }), // Custom error for nonempty
    categoryType: z.enum(["inflow", "outflow"], {
      errorMap: () => ({ message: "categoryType must be 'inflow' or 'outflow'" }),
    }),
    parentCategoryId: z.string().nullable().optional(), // Allows null or undefined
  }),
}); // Ensures no extra fields are present

export const categoryValidation = {
  categorySchema,
};
