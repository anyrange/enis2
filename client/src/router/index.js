import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/store";

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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();
  if (to.meta.authRequired && !auth.authenticated)
    return next({ name: "login" });
  if (to.meta.authForbidden && auth.authenticated)
    return next({ name: "dashboard" });
  next();
});

export default router;
