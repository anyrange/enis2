<template>
  <q-page class="flex flex-center">
    <q-card class="lg:w-1/3 xl:w-1/4" flat bordered>
      <q-form @submit="submit" greedy>
        <q-card-section>
          <div class="q-mb-md flex row items-center z">
            <enis-icon style="height: 70px;weight: 70px;" />
            <div class="flex column items-start q-my-sm q-ml-md">
              <div class="text-h5 text-weight-medium text-grey-8">
                enis
                <q-badge align="top" outline color="primary">v2.0</q-badge>
              </div>
              <div class="text-subtitle1">- удобный, быстрый, адаптивный</div>
            </div>
          </div>
          <q-input
            autofocus
            unelevated
            v-model="user.login"
            label="Ваш ИИН"
            mask="############"
            :rules="[
              (val) =>
                (val && val.length <= 12) || 'ИИН должен содержать 12 символов',
            ]"
            :lazy-rules="'ondemand'"
            no-error-icon
          />
          <q-input
            type="password"
            unelevated
            v-model="user.password"
            label="Ваш пароль"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Пароль не можеть быть пустым',
            ]"
            :lazy-rules="'ondemand'"
            no-error-icon
          />
          <template v-if="captcha">
            <img :src="`data:image/png;base64,${captcha}`" />
            <q-input
              autofocus
              type="text"
              unelevated
              label="Каптча"
              v-model="user.captchaInput"
              no-error-icon
            />
          </template>
          <q-select
            class="q-my-sm"
            filled
            v-model="city"
            unelevated
            :options="citiesList"
            options-cover
            stack-label
            @input="saveCity()"
            label="Школа"
          />
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            type="submit"
            unelevated
            color="primary"
            size="md"
            class="full-width q-mb-sm"
            label="Войти"
            ref="submitBtn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EnisIcon from "@/components/icons/EnisIcon";
import api from "@/api";
import cities from "@/cities.json";

const defaultCity = { value: "sms.pvl.nis.edu.kz", label: "Павлодар ХБН" };

export default {
  components: {
    EnisIcon,
  },
  data() {
    return {
      user: {
        login: "",
        password: "",
        captchaInput: "",
      },
      captcha: "",
      city: {},
      citiesList: cities,
    };
  },
  computed: {
    ...mapGetters({
      savedCity: "getCity",
    }),
  },
  created() {
    this.city = this.savedCity || defaultCity;
  },
  methods: {
    ...mapActions(["auth", "setCity"]),
    submit() {
      this.setCity(this.city, this.city.value);
      api
        .login(this.user, this.city.value)
        .then((response) => {
          const success = response.success;
          this.auth({ success });
          this.$router.push({ name: "dashboard" });
        })
        .catch((error) => {
          if (error.response.data.data) {
            this.captcha = error.response.data.data.base64img;
            this.user.captchaInput = "";
          }
          this.$q.notify({
            color: "negative",
            position: "bottom-left",
            message: error.response.data.message,
            progress: true,
            timeout: 1500,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
}

@media (min-width: 1024px) {
  .lg\:w-1\/3 {
    width: 33.333333%;
  }
}
@media (min-width: 1280px) {
  .xl\:w-1\/4 {
    width: 25%;
  }
}
</style>
