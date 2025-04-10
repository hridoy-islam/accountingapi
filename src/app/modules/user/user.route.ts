/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
router.get(
  "/",
  auth("admin", "user","company","manager","audit"),
  UserControllers.getAllUser
);
router.get(
  "/company/:id",
  auth("admin", "user","company","manager","audit"),
  UserControllers.getAllCompanyUser
);
router.get(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  UserControllers.getSingleUser
);

router.patch(
  "/:id",
  auth("admin", "user","company","manager","audit"),
  UserControllers.updateUser
);


export const UserRoutes = router;
