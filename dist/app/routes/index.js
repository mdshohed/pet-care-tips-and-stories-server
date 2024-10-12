"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const post_route_1 = require("../modules/post/post.route");
const postCategory_route_1 = require("../modules/postCategory/postCategory.route");
const profile_route_1 = require("../modules/Profile/profile.route");
const imageUpload_routes_1 = require("../modules/ImageUpload/imageUpload.routes");
const meilisearch_routes_1 = require("../modules/Meilisearch/meilisearch.routes");
const stripe_route_1 = require("../modules/Stripe/stripe.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: '/post-categories',
        route: postCategory_route_1.PostCategoryRoutes,
    },
    {
        path: "/posts",
        route: post_route_1.PostRoutes,
    },
    {
        path: '/search-items',
        route: meilisearch_routes_1.MeilisearchRoutes,
    },
    {
        path: '/profile',
        route: profile_route_1.ProfileRoutes,
    },
    {
        path: "/image-upload",
        route: imageUpload_routes_1.ImageUploadRoutes
    },
    {
        path: "/create-payment-intent",
        route: stripe_route_1.StripeRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
