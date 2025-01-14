/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryControllers } from "./category.controller";


const router = express.Router();


router.post(
  "/",
  // auth('admin'),
  validateRequest(categoryValidation.categorySchema),
  categoryControllers.categoryCreate
);

router.delete(
  "/:id",
  // auth('admin'),
  validateRequest(categoryValidation.categorySchema),
  categoryControllers.categoryDelete
);

router.patch(
  "/:id",
  // auth("admin", "user"),
  categoryControllers.categoryUpdate
);

router.get(
  "/",
  // auth("admin", "user"),
  categoryControllers.getAllCategorys
);

router.get(
  "/:id",
  // auth('admin'),
  categoryControllers.getOneCategory
)









export const categoryRoute = router;

