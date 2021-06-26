import { createRouter, createWebHistory } from "vue-router";
import $store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next({ name: "dashboard" }) : next();
    },
  },
  {
    path: "/home",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next() : next({ name: "login" });
    },
  },
  {
    path: "/new/",
    name: "_login",
    component: () => import("@/views/new/Login.vue"),
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next({ name: "_dashboard" }) : next();
    },
  },
  {
    path: "/new/home",
    name: "_dashboard",
    component: () => import("@/views/new/Dashboard.vue"),
    beforeEnter(to, from, next) {
      $store.getters.isAuthenticated ? next() : next({ name: "_login" });
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "login" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
