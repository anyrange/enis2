import { createRouter, createWebHistory } from "vue-router";
import $store from "@/store";

const authenticated = () => {
  return $store.getters.isAuthenticated;
};

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      authenticated() ? next({ name: "dashboard" }) : next();
    },
  },
  {
    path: "/home",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    beforeEnter(to, from, next) {
      authenticated() ? next() : next({ name: "login" });
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
