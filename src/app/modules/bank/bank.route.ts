/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/multer";
import { BankControllers } from "./bank.controller";
// import auth from '../../middlewares/auth';

const router = express.Router();
router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  BankControllers.getAllBank
);
router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  BankControllers.BankCreate
);
router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  BankControllers.getSingleBank
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  BankControllers.updateBank
);


export const BankRoutes = router;
