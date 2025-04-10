import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PermissionServices } from "./permission.service";
import { CompanyPermissions } from "./permission.interface";

const validRoles = ['admin', 'manager', 'user', 'audit'];

const initializePermissions = catchAsync(async (req, res) => {
  const { companyId } = req.params;

  const result = await PermissionServices.initializeCompanyPermissionsInDB(companyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions initialized successfully",
    data: result,
  });
});

const getPermissions = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const { role, module } = req.query;

  if (role && !validRoles.includes(role as string)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid role provided",
      data: null,
    });
  }

  const filters: Record<string, unknown> = {
    ...(role && { role }),
    ...(module && { module }),
    ...req.query,
  };

  const result = await PermissionServices.getPermissionsFromDB(companyId, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions retrieved successfully",
    data: result,
  });
});

const updatePermissions = catchAsync(async (req, res) => {
  const { companyId, role, module } = req.params;
  const newPermissions = req.body;

  if (!validRoles.includes(role)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid role provided",
      data: null,
    });
  }

  // Special handling for auditAccess update
  if (module === "auditAccess") {
    const { storages, methods } = newPermissions;

    if (
      (storages && (!Array.isArray(storages) || !storages.every(item => typeof item === "string"))) ||
      (methods && (!Array.isArray(methods) || !methods.every(item => typeof item === "string")))
    ) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid auditAccess data. 'storages' and 'methods' must be arrays of strings.",
        data: null,
      });
    }

    const result = await PermissionServices.updatePermissionsInDB(
      companyId,
      role,
      module as keyof CompanyPermissions,
      { storages, methods }
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Audit access updated successfully",
      data: result,
    });
  }

  // Validate permission fields for standard modules
  const validPermissions = ['create', 'view', 'edit', 'delete'];
  for (const key of Object.keys(newPermissions)) {
    if (!validPermissions.includes(key)) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: `Invalid permission field: ${key}`,
        data: null,
      });
    }
  }

  const result = await PermissionServices.updatePermissionsInDB(
    companyId,
    role,
    module as keyof CompanyPermissions,
    newPermissions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions updated successfully",
    data: result,
  });
});


export const PermissionControllers = {
  initializePermissions,
  getPermissions,
  updatePermissions,
};
