import express from "express";
import auth from "../../middlewares/auth";
import { PermissionControllers } from "./permission.controller";

const router = express.Router();

router.post(
  '/initialize/:companyId',
auth("admin", "user","company","manager","audit"),
  PermissionControllers.initializePermissions
);

router.get(
  '/:companyId',
  auth('admin', 'company','manager', 'user', 'audit'), 
  PermissionControllers.getPermissions
);


router.patch(
  '/:companyId/:role/:module',
auth("admin", "user","company","manager","audit"),
  PermissionControllers.updatePermissions
);

export const PermissionRoutes = router;
