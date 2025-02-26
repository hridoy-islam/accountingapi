/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { reportControllers } from "./report.controller";

const router = express.Router();

router.get(
  "/company/:id",
  auth("admin", "user", "company"),
  reportControllers.getReport
);

export const reportRoute = router;
