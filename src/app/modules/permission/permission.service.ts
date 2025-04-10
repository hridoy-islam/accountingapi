import QueryBuilder from "../../builder/QueryBuilder";
import Permission from "./permission.model";
import {
  CompanyPermissionDocument,
  CompanyPermissions,
  ModulePermissions
} from "./permission.interface";
import { FilterQuery } from "mongoose";

/**
 * Initializes default permissions for a new company
 */
const initializeDefaultPermissions = (): Record<string, CompanyPermissions> => ({
 
  manager: {
    Invoice: { create: true, view: true, edit: false, delete: false },
    Customer: { create: true, view: true, edit: false, delete: false },
    TransactionList: { create: true, view: true, edit: false, delete: false },
    PendingTransaction: { create: true, view: true, edit: false, delete: false },
    CSVUpload: { create: true, view: true, edit: false, delete: false },
    ArchiveTransaction: { create: true, view: true, edit: false, delete: false },
    Report: { create: true, view: true, edit: false, delete: false },
    Method: { create: true, view: true, edit: false, delete: false },
    Storage: { create: true, view: true, edit: false, delete: false },
    Category: { create: true, view: true, edit: false, delete: false },
    CreateUser: { create: false, view: true, edit: false, delete: false },
    CompanyDetails: { create: false, view: true, edit: false, delete: false },
    auditAccess: { storages: [], methods: [] }
  },
  user: {
    Invoice: { create: false, view: true, edit: false, delete: false },
    Customer: { create: false, view: true, edit: false, delete: false },
    TransactionList: { create: false, view: true, edit: false, delete: false },
    PendingTransaction: { create: false, view: true, edit: false, delete: false },
    CSVUpload: { create: false, view: true, edit: false, delete: false },
    ArchiveTransaction: { create: false, view: true, edit: false, delete: false },
    Report: { create: false, view: true, edit: false, delete: false },
    Method: { create: false, view: true, edit: false, delete: false },
    Storage: { create: false, view: true, edit: false, delete: false },
    Category: { create: false, view: true, edit: false, delete: false },
    CreateUser: { create: false, view: false, edit: false, delete: false },
    CompanyDetails: { create: false, view: false, edit: false, delete: false },
    auditAccess: { storages: [], methods: [] }
  },
  audit: {
    Invoice: { create: false, view: true, edit: false, delete: false },
    Customer: { create: false, view: true, edit: false, delete: false },
    TransactionList: { create: false, view: true, edit: false, delete: false },
    PendingTransaction: { create: false, view: true, edit: false, delete: false },
    CSVUpload: { create: false, view: true, edit: false, delete: false },
    ArchiveTransaction: { create: false, view: true, edit: false, delete: false },
    Report: { create: false, view: true, edit: false, delete: false },
    Method: { create: false, view: true, edit: false, delete: false },
    Storage: { create: false, view: true, edit: false, delete: false },
    Category: { create: false, view: true, edit: false, delete: false },
    CreateUser: { create: false, view: false, edit: false, delete: false },
    CompanyDetails: { create: false, view: false, edit: false, delete: false },
    auditAccess: { storages: [], methods: [] }
  }
});


const initializeCompanyPermissionsInDB = async (companyId: string) => {
  const existingPermissions = await Permission.findOne({ companyId });
  if (existingPermissions) {
    return existingPermissions;
  }

  const permissionDoc = await Permission.create({
    companyId,
    permissions: initializeDefaultPermissions()
  });

  return permissionDoc;
};

/**
 * Retrieves permission data for a company, supports filtering/sorting/pagination
 */
const getPermissionsFromDB = async (
  companyId: string,
  query: Record<string, unknown> = {}
) => {
  const baseFilter: FilterQuery<CompanyPermissionDocument> = { companyId };

  const permissionQuery = new QueryBuilder(
    Permission.find(baseFilter),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await permissionQuery.modelQuery;
  const meta = await permissionQuery.countTotal();

  return { meta, result };
};

/**
 * Updates permissions of a specific role/module for a company
 */
const updatePermissionsInDB = async (
  companyId: string,
  role: string,
  module: keyof CompanyPermissions,
  newPermissions: Partial<ModulePermissions> | { storages?: string[], methods?: string[] }
) => {
  const updateQuery: Record<string, any> = {};

  // Special case for auditAccess
  if (module === 'auditAccess') {
    const auditFields = newPermissions as { storages?: string[], methods?: string[] };

    if (auditFields.storages) {
      updateQuery[`permissions.${role}.auditAccess.storages`] = auditFields.storages;
    }

    if (auditFields.methods) {
      updateQuery[`permissions.${role}.auditAccess.methods`] = auditFields.methods;
    }

  } else {
    const permissionFields = newPermissions as Partial<ModulePermissions>;
    for (const [key, value] of Object.entries(permissionFields)) {
      updateQuery[`permissions.${role}.${module}.${key}`] = value;
    }
  }

  const updatedDoc = await Permission.findOneAndUpdate(
    { companyId },
    { $set: updateQuery },
    { new: true, runValidators: true }
  );

  return updatedDoc;
};

export const PermissionServices = {
  initializeCompanyPermissionsInDB,
  getPermissionsFromDB,
  updatePermissionsInDB
};
