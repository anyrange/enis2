import colors from "windicss/colors";

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...colors,
        "gray-1000-spotify": "#080707",
        "gray-950-spotify": "#191414",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#1d1d1d",
        "gray-700-spotify": "#282828",
        "gray-600-spotify": "#333333",
        "gray-500-spotify": "#ABABAB",
        "gray-450-spotify": "#535353",
        "gray-400-spotify": "#bfbfbf",
        "q-positive": "#21ba45",
        "q-negative": "#c20318",
        "q-warning": "#f2c037",
        "q-info": "#31ccec",
      },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
      },
      fontSize: {
        xxs: "0.7rem",
      },
    },
  },
};
