import mongoose, { Schema, Document } from "mongoose";
import { CompanyPermissionDocument, RolePermissions, CompanyPermissions, ModulePermissions } from "./permission.interface";

// Define the ModulePermissions sub-schema
const ModulePermissionsSchema = new Schema<ModulePermissions>({
  create: { type: Boolean, required: true },
  view: { type: Boolean, required: true },
  edit: { type: Boolean, required: true },
  delete: { type: Boolean, required: true }
}, { _id: false });

// Define the AuditAccess sub-schema
const AuditAccessSchema = new Schema({
  storages: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Storage',
    default: [] 
  }],
  methods: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Method',
    default: [] 
  }]
}, { _id: false });

// Define the CompanyPermissions schema
const CompanyPermissionsSchema = new Schema<CompanyPermissions>({
  Invoice: { type: ModulePermissionsSchema, required: true },
  Customer: { type: ModulePermissionsSchema, required: true },
  TransactionList: { type: ModulePermissionsSchema, required: true },
  PendingTransaction: { type: ModulePermissionsSchema, required: true },
  CSVUpload: { type: ModulePermissionsSchema, required: true },
  ArchiveTransaction: { type: ModulePermissionsSchema, required: true },
  Report: { type: ModulePermissionsSchema, required: true },
  Method: { type: ModulePermissionsSchema, required: true },
  Storage: { type: ModulePermissionsSchema, required: true },
  Category: { type: ModulePermissionsSchema, required: true },
  CreateUser: { type: ModulePermissionsSchema, required: true },
  CompanyDetails: { type: ModulePermissionsSchema, required: true },
  auditAccess: { type: AuditAccessSchema, required: true }
}, { _id: false });

// Main Permission Schema
const PermissionSchema = new Schema<CompanyPermissionDocument>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true 
  },
  permissions: {
    type: Map,
    of: CompanyPermissionsSchema,
    required: true
  }
});

const Permission = mongoose.model<CompanyPermissionDocument>("Permission", PermissionSchema);

export default Permission;
