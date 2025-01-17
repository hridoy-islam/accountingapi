import { z } from "zod";

const categorySchema = z.object({
  body: z.object({
    name: z.string(),
    type: z.enum(["inflow", "outflow"]),
    parentId: z.string().nullable(),
    audit: z.enum(["Active", "Inactive"]),
    status: z.enum(["Active", "Inactive"]),
  }),
}); // Ensures no extra fields are present

export const categoryValidation = {
  categorySchema,
};



