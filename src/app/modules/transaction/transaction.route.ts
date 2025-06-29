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
  auth("admin", "user","company","manager","audit"),

  
  // upload.single('transactionDoc'),
  validateRequest(transactionValidation.transactionSchema),
  transactionControllers.transactionCreate
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
  auth("admin", "user","company","manager","audit"),
  transactionControllers.transactionUpdate
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  transactionControllers.getAlltransactions
);
router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  transactionControllers.getAllCompanytransactions
);
router.get(
  "/company-transaction/:id",
  auth("admin", "user","company","manager","audit"),
  transactionControllers.getyearlyCompanytransactions
);

router.get(
  "/:id",
  auth('admin',"company"),
  transactionControllers.getOnetransaction
)









export const transactionRoute = router;

