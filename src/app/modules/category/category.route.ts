/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryControllers } from "./category.controller";


const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  validateRequest(categoryValidation.categorySchema),
  categoryControllers.categoryCreate
);

router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  categoryControllers.getCategoryByCompany
);
router.delete(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  categoryControllers.categoryDelete
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  categoryControllers.categoryUpdate
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  categoryControllers.getAllCategorys
);

router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  categoryControllers.getOneCategory
)

export const categoryRoute = router;

