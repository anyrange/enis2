import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "login",
    meta: {
      title: "Enis2",
    },
    component: () => import("@/views/Login.vue"),
    beforeEnter(to, from, next) {
      store.getters.isLoggedIn ? next({ name: "dashboard" }) : next();
    },
  },
  {
    path: "/dash",
    name: "dashboard",
    meta: {
      title: "Dashboard",
    },
    component: () => import("@/views/Dashboard.vue"),
    beforeEnter(to, from, next) {
      store.getters.isLoggedIn ? next() : next({ name: "login" });
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
