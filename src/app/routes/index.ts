import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { PostRoutes } from "../modules/post/post.route";
import { PostCategoryRoutes } from "../modules/postCategory/postCategory.route";
import { ProfileRoutes } from "../modules/Profile/profile.route";
import { ImageUploadRoutes } from "../modules/ImageUpload/imageUpload.routes";
import { StripeRoutes } from "../modules/Stripe/stripe.route";

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
  {
    path: '/post-categories',
    route: PostCategoryRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: "/image-upload",
    route: ImageUploadRoutes
  },
  {
    path: "/create-payment-intent",
    route: StripeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
