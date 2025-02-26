/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import auth from "../../middlewares/auth";
import { storageControllers } from "./storage.controller";
import validateRequest from "../../middlewares/validateRequest";
import { storageValidation } from "./storage.validation";


const router = express.Router();


router.post(
  "/",
  auth('admin','company'),
  validateRequest(storageValidation.storageSchema),
  storageControllers.storageCreate
);

router.delete(
  "/:id",
  auth('admin',"company"),
  validateRequest(storageValidation.storageSchema),
  storageControllers.storageDelete
);

router.patch(
  "/:id",
  auth("admin", "user","company"),
  storageControllers.storageUpdate
);

router.get(
  "/",
  auth("admin", "user","company"),
  storageControllers.getAllStorages
);

router.get(
  "/:id",
  auth('admin',"company"),
  storageControllers.getOneStorage
)









export const storageRoute = router;

