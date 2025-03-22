/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { transactionValidation } from "./transaction.validation";
import { transactionControllers } from "./transaction.controller";

import { upload } from "../../utils/multer";


const router = express.Router();


router.post(
  "/",
  auth("admin", "user"),
  // auth('admin'),
  
  // upload.single('transactionDoc'),
  validateRequest(transactionValidation.transactionSchema),
  transactionControllers.transactionCreate
);

router.post("/data/store", 
 
  transactionControllers.storeTransaction
);

// router.post('/company/:companyId', upload.single('file'), transactionControllers.uploadCsv)

router.delete(
  "/:id",
  auth("admin"),
  validateRequest(transactionValidation.transactionSchema),
  transactionControllers.transactionDelete
);

router.patch(
  "/:id",
  auth("admin", "user","company"),
  transactionControllers.transactionUpdate
);

router.get(
  "/",
  auth("admin", "user","company"),
  transactionControllers.getAlltransactions
);
router.get(
  "/company/:id",
  // auth("admin", "user","company"),
  transactionControllers.getAllCompanytransactions
);

router.get(
  "/:id",
  auth('admin',"company"),
  transactionControllers.getOnetransaction
)









export const transactionRoute = router;

