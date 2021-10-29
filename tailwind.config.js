module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // Dracula color palette
      colors: {
        drBackground: "#282a36",
        drCurrentLine: "#44475a",
        drForeGround: "#f8f8f2",
        drComment: "#6272a4",
        drCyan: "#8be9fd",
        drGreen: "#50fa7b",
        drOrange: "#ffb86c",
        drPink: "#ff79c6",
        drPurple: "#bd93f9",
        drRed: "#ff5555",
        drYellow: "#f1fa8c",

        // 80s after dark
        adBgColor: "#1b1d36",
        adMainColor: "#fca6d1",
        adCaretColor: "#99d6ea",
        adSubColor: "#99d6ea",
        adTextColor: "#fca6d1",
        adErrorColor: "#fffb85",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
