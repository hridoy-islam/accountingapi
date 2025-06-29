/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { storageControllers } from "./transaction-overview.controller";

const router = express.Router();



router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  storageControllers.getCompanyStorage
);









export const storageRoute = router;

