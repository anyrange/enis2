<template>
  <q-page-container>
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
              type="number"
              autofocus
              unelevated
              v-model="user.login"
              label="Ваш ИИН"
              mask="############"
              :rules="[
                (val) =>
                  (val && val.length === 12) ||
                  'ИИН должен содержать 12 символов',
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
                  (val &&
                    val.match(
                      `[A-za-z0-9!,@,#,$,%,^,&,*,(,),-,=,_,+,~]{6,}`
                    )) ||
                  'Неверный формат',
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
              :loading="loading"
            />
          </q-card-actions>
        </q-form>
        <!-- <q-separator />
        <q-card-section class="text-subitle2">
        </q-card-section> -->
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EnisIcon from "@/components/icons/EnisIcon";
import { login } from "@/api";
import cities from "@/cities.json";

const defaultCity = { value: "sms.pvl.nis.edu.kz", label: "Павлодар ХБН" };
const regExp = new RegExp(`[A-za-z0-9!,@,#,$,%,^,&,*,(,),-,=,_,+,~]{6,}`);

export default {
  components: {
    EnisIcon,
  },
  data() {
    return {
      loading: false,
      user: {
        login: "",
        password: "",
        captchaInput: "",
      },
      passwordRegex: regExp,
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
      this.loading = true;
      this.setCity(this.city);
      login(this.user)
        .then((response) => {
          const success = response.success;
          this.auth({ success });
          this.$router.push({ name: "dashboard" });
        })
        .finally(() => {
          this.loading = false;
        })
        .catch((error) => {
          if (error.response.data.data) {
            this.captcha = error.response.data.data.base64img;
            this.user.captchaInput = "";
          }
        });
    },
  },
};
</script>
