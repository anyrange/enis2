import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./assets/tailwind.css";
import "./assets/styles.css";
import Spinner from "@/components/Spinner";
import VWave from "v-wave";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";

const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(VWave)
  .use(Quasar, quasarUserOptions)
  .use(Toast, {
    position: POSITION.BOTTOM_LEFT,
  })
  .mount("#app");

app.component("Spinner", Spinner);
