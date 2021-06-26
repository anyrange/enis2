module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: "class",
  theme: {
    extend: {
      transformOrigin: {
        "0": "0%",
      },
      zIndex: {
        "-1": "-1",
      },
      colors: {
        "gray-1000-spotify": "#080707",
        "gray-950-spotify": "#191414",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#181818",
        "gray-700-spotify": "#282828",
        "gray-600-spotify": "#333333",
        "gray-500-spotify": "#ABABAB",
        "gray-450-spotify": "#535353",
        "gray-400-spotify": "#bfbfbf",
      },
    },
  },
  variants: {
    extend: {
      translate: ["motion-safe"],
    },
  },
};