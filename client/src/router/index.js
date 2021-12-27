import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { authForbidden: true },
  },
  {
    path: "/home",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { authRequired: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "login" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthorized = store.getters["auth/authenticated"];
  if (to.meta.authRequired && !isAuthorized) return next({ name: "login" });
  if (to.meta.authForbidden && isAuthorized) return next({ name: "dashboard" });
  next();
});

export default router;
