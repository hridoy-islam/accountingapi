import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.router";
import { storageRoute } from "../modules/stroage/storage.route";
import { transactionMethodRoute } from "../modules/transactionMethod/transcationMethod.route";
import { categoryRoute } from "../modules/category/category.route";
import { transactionRoute } from "../modules/transaction/transaction.route";

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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
