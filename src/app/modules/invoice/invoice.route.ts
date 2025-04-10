import express from "express";
import { InvoiceControllers } from "./invoice.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { invoiceValidation } from "./invoice.validation";

const router = express.Router();

router.post(
  "/",
  auth("admin", "user","company","manager","audit"),
  validateRequest(invoiceValidation.invoiceSchema),
  InvoiceControllers.createInvoice
);

router.delete(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  validateRequest(invoiceValidation.invoiceSchema),
  InvoiceControllers.deleteInvoice
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  InvoiceControllers.updateInvoice
);

router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  InvoiceControllers.getAllInvoices
);

router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  InvoiceControllers.getAllCompanyInvoices
);

router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  InvoiceControllers.getOneInvoice
);

export const invoiceRouter = router;
