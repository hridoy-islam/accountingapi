import express from "express";
import { PendingTransactionControllers } from "./pending.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { PendingTransactionValidation } from "./pending.validation";

const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company"),
  validateRequest(PendingTransactionValidation.pendingTransactionSchema),
  PendingTransactionControllers.createPendingTransaction
);

router.delete(
  "/:id",
  auth("admin","company"),
  validateRequest(PendingTransactionValidation.pendingTransactionSchema),
  PendingTransactionControllers.deletePendingTransaction
);

router.patch(
  "/:id",
  auth("admin", "user", "company"),
  PendingTransactionControllers.updatePendingTransaction
);

router.get(
  "/",
  auth("admin", "user", "company"),
  PendingTransactionControllers.getAllPendingTransactions
);

router.get(
  "/company/:id",
  auth("admin", "company","user"),
  PendingTransactionControllers.getAllCompanyPendingTransactions
);

router.get(
  "/:id",
  auth("admin", "company"),
  PendingTransactionControllers.getOnePendingTransaction
);

router.post("/data/store", 
 
  PendingTransactionControllers.storePendingTransaction
);

export const PendingTransactionRouter = router;
