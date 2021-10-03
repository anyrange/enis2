module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
      },
      colors: {
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
