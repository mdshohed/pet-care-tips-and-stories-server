import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { BikeRoutes } from "../modules/Bike/bike.route";
import { RentalRoutes } from "../modules/Rental/rental.route";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
