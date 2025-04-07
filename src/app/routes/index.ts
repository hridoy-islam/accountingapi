import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.router";
import { storageRoute } from "../modules/stroage/storage.route";
import { transactionMethodRoute } from "../modules/transactionMethod/transcationMethod.route";
import { categoryRoute } from "../modules/category/category.route";
import { transactionRoute } from "../modules/transaction/transaction.route";
import { companyRoute } from "../modules/company/company.route";
import { reportRoute } from "../modules/report/report.route";
import { invoiceRouter } from "../modules/invoice/invoice.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { PendingTransactionRouter } from "../modules/pending-transaction/pending.route";
import { CSVRouter } from "../modules/csv/csv.route";
import { UploadDocumentRoutes } from "../modules/documents/documents.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: '/methods',
    route: transactionMethodRoute
  }
  ,
  {
    path: '/storages',
    route: storageRoute
  }
  ,
  {
    path: '/categories',
    route: categoryRoute
  }
  ,
  {
    path: '/transactions',
    route: transactionRoute
  },
  {
    path: '/companies',
    route: companyRoute
  },
  {
    path: '/report',
    route: reportRoute
  },
  {
    path: '/invoice',
    route: invoiceRouter
  },
  {
    path: '/csv',
    route: CSVRouter
  },
  {
    path: '/customer',
    route: CustomerRoutes
  },
  {
    path: '/pending-transaction',
    route: PendingTransactionRouter
  },

  {
    path: '/documents',
    route: UploadDocumentRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
