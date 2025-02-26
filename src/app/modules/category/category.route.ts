/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryControllers } from "./category.controller";


const router = express.Router();


router.post(
  "/",
  auth('admin',"company"),
  validateRequest(categoryValidation.categorySchema),
  categoryControllers.categoryCreate
);

router.delete(
  "/:id",
  auth('admin',"company"),
  validateRequest(categoryValidation.categorySchema),
  categoryControllers.categoryDelete
);

router.patch(
  "/:id",
  auth("admin", "user","company"),
  categoryControllers.categoryUpdate
);

router.get(
  "/",
  auth("admin", "user","company"),
  categoryControllers.getAllCategorys
);

router.get(
  "/:id",
  auth('admin',"company"),
  categoryControllers.getOneCategory
)









export const categoryRoute = router;

