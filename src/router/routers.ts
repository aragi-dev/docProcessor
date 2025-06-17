import { Role } from "@/utils/enums/Role";
import type { RouteRecordRaw } from "vue-router";

// Base
const Main = () => import("@/layouts/MainLayout.vue");
const login = () => import("@/views/LoginView.vue");
const NotFound = () => import("@/views/NotFoundView.vue");

// Views
const Home = () => import("@/views/HomeView.vue");

const routerOptions: RouteRecordRaw[] = [
  {
    path: "/",
    component: Main,
    redirect: { name: "Home" },
    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
        meta: {
          title: "Home",
          requiresAuth: true,
          roles: [Role.ADMIN, Role.USER],
        },
      },
      {
        path: "user",
        name: "User",
        component: User,
        meta: {
          title: "User",
          requiresAuth: true,
          roles: [Role.ADMIN],
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: login,
    meta: { title: "Login" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { title: "Not Found" },
  },
];

export default routerOptions;
