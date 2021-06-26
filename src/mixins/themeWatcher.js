import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({ theme: "getTheme" }),
  },
  methods: {
    ...mapActions(["setTheme"]),
  },
  watch: {
    theme: {
      handler: function() {
        if (this.theme === "dark") {
          document.documentElement.classList.add("dark");
          this.$q.dark.set(true);
        } else {
          document.documentElement.classList.remove("dark");
          this.$q.dark.set(false);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.setTheme();
  },
};
