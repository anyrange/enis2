import colors from "windicss/colors";

export default {
  darkMode: "class",
  shortcuts: {
    "default-focus": "outline-none focus:outline-none focus-visible:ring-2",
  },
  theme: {
    extend: {
      colors: {
        primary: colors.blue[500],
        secondary: {
          darkest: "#121212",
          darker: "#1d1d1d",
          dark: "#282828",
          DEFAULT: "#333333",
          light: "#969696",
          lighter: "#ABABAB",
          lightest: "#BFBFBF",
        },
        q: {
          positive: "#21ba45",
          negative: "#c20318",
          warning: "#f2c037",
          info: "#31ccec",
        },
      },
      fontSize: {
        xxs: "0.7rem",
      },
    },
  },
};
