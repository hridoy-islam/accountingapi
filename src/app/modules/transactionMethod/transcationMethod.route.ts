/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { transactionMethodControllers } from "./transactionMethod.controller";
import validateRequest from "../../middlewares/validateRequest";
import { transactionMethodValidation } from "./transactionMethod.validation";


const router = express.Router();


router.post(
  "/",
  auth("admin", "user"),
  validateRequest(transactionMethodValidation.transactionMethodSchema),
  transactionMethodControllers.transactionMethodCreate
);

router.delete(
  "/:id",
  auth("admin", "user"),
  transactionMethodControllers.transactionMethodDelete
);

router.patch(
  "/:id",
  auth("admin", "user"),
  transactionMethodControllers.transactionMethodUpdate
);

router.get(
  "/",
  auth("admin", "user"),
  transactionMethodControllers.getAllMethods
);

router.get(
  "/:id",
  auth("admin", "user"),
  transactionMethodControllers.getOneMethod
)









export const transactionMethodRoute = router;

