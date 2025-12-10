import express from "express";
import { ScheduleInvoiceControllers } from "./scheduleInvoice.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ScheduleInvoiceValidation } from "./scheduleInvoice.validation";


const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  validateRequest(ScheduleInvoiceValidation.ScheduleInvoiceSchema),
  ScheduleInvoiceControllers.createScheduleInvoice
);

router.delete(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  validateRequest(ScheduleInvoiceValidation.ScheduleInvoiceSchema),
  ScheduleInvoiceControllers.deleteScheduleInvoice
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  ScheduleInvoiceControllers.updateScheduleInvoice
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  ScheduleInvoiceControllers.getAllScheduleInvoices
);

router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  ScheduleInvoiceControllers.getAllCompanyScheduleInvoices
);

router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  ScheduleInvoiceControllers.getOneScheduleInvoice
);

export const ScheduleInvoiceRouter = router;
