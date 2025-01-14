import { z } from "zod";

const categorySchema = z.object({
  categoryName: z.string().nonempty("categoryName is required"), // Ensure it's not empty
  categoryType: z.enum(["inflow", "outflow"], {
    errorMap: () => ({ message: "categoryType must be 'inflow' or 'outflow'" }),
  }),
  parentCategoryId: z.string().nullable(), // Correct type for ObjectId
});

export const categoryValidation = {
  categorySchema,
};
