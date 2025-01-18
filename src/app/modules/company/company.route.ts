/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { companyValidation } from "./company.validation";
import { companyControllers } from "./company.controller";


const router = express.Router();

router.post(
  "/",
  // auth('admin'),
  validateRequest(companyValidation.companySchema),
  companyControllers.companyCreate
);

router.delete(
  "/:id",
  // auth('admin'),
  // validateRequest(categoryValidation.categorySchema),
  companyControllers.companyDelete
);

router.patch(
  "/:id",
  // auth("admin", "user"),
  companyControllers.companyUpdate
);

router.get(
  "/",
  // auth("admin", "user"),
  companyControllers.getAllcompanys
);

router.get(
  "/:id",
  // auth('admin'),
  companyControllers.getOnecompany
)

router.post('/:companyId/user/:userId', companyControllers.assignUser);

router.delete('/:companyId/user/:userId', companyControllers.removeAssignUser);

export const companyRoute = router;

