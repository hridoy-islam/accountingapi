import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.router";
import { storageRoute } from "../modules/stroage/storage.route";
import { transactionMethodRoute } from "../modules/transactionMethod/transcationMethod.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
