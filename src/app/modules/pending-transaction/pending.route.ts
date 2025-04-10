import express from "express";
import { PendingTransactionControllers } from "./pending.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { PendingTransactionValidation } from "./pending.validation";

const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  validateRequest(PendingTransactionValidation.pendingTransactionSchema),
  PendingTransactionControllers.createPendingTransaction
);

router.delete(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  PendingTransactionControllers.deletePendingTransaction
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  PendingTransactionControllers.updatePendingTransaction
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  PendingTransactionControllers.getAllPendingTransactions
);

router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  PendingTransactionControllers.getAllCompanyPendingTransactions
);

router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  PendingTransactionControllers.getOnePendingTransaction
);

router.post("/data/store", 
 
  PendingTransactionControllers.storePendingTransaction
);

export const PendingTransactionRouter = router;
