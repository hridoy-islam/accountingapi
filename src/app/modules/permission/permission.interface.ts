import { Types } from "mongoose";

export interface ModulePermissions {
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

// New interface for audit access
export interface AuditAccess {
  storages: string[];
  methods: string[];
}

// Extend CompanyPermissions to include auditAccess
export interface CompanyPermissions {
  Invoice: ModulePermissions;
  Customer: ModulePermissions;
  TransactionList: ModulePermissions;
  PendingTransaction: ModulePermissions;
  CSVUpload: ModulePermissions;
  ArchiveTransaction: ModulePermissions;
  Report: ModulePermissions;
  Method: ModulePermissions;
  Storage: ModulePermissions;
  Category: ModulePermissions;
  CreateUser: ModulePermissions;
  CompanyDetails: ModulePermissions;
  auditAccess: AuditAccess;
}

export interface RolePermissions {
  [role: string]: CompanyPermissions;
}

export interface CompanyPermissionDocument extends Document {
  companyId: Types.ObjectId;
  permissions: RolePermissions;
}
