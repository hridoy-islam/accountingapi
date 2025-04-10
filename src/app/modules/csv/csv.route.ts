import express from "express";
import { CSVControllers } from "./csv.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.createCSV
);

router.delete(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.deleteCSV
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.updateCSV
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.getAllCSVs
);

router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.getAllCompanyCSVs
);

router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  CSVControllers.getOneCSV
);

export const CSVRouter = router;
