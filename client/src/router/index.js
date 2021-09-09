import { createRouter, createWebHistory } from "vue-router";
import $store from "../store";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const authenticated = () => {
  return $store.getters["auth/isAuthenticated"];
};

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    beforeEnter(to, from, next) {
      authenticated() ? next({ name: "dashboard" }) : next();
    },
  },
  {
    path: "/home",
    name: "dashboard",
    component: Dashboard,
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
  history: createWebHistory(),
  routes,
});

export default router;
