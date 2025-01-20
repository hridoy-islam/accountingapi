/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { transactionValidation } from "./transaction.validation";
import { transactionControllers } from "./transaction.controller";


const router = express.Router();


router.post(
  "/",
  // auth('admin'),
  validateRequest(transactionValidation.transactionSchema),
  transactionControllers.transactionCreate
);

router.post('/', transactionControllers.uploadCsv)

router.delete(
  "/:id",
  // auth('admin'),
  validateRequest(transactionValidation.transactionSchema),
  transactionControllers.transactionDelete
);

router.patch(
  "/:id",
  // auth("admin", "user"),
  transactionControllers.transactionUpdate
);

router.get(
  "/",
  // auth("admin", "user"),
  transactionControllers.getAlltransactions
);

router.get(
  "/:id",
  // auth('admin'),
  transactionControllers.getOnetransaction
)









export const transactionRoute = router;

