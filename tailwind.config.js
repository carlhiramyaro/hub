/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e53e3e",
          hover: "#c53030",
        },
        secondary: {
          DEFAULT: "#ed8936",
          hover: "#dd6b20",
        },
        accent: {
          DEFAULT: "#38b2ac",
          hover: "#319795",
        },
        muted: {
          DEFAULT: "#718096",
          hover: "#4a5568",
        },
        success: {
          DEFAULT: "#48bb78",
          hover: "#38a169",
        },
        warning: {
          DEFAULT: "#ecc94b",
          hover: "#d69e2e",
        },
        error: {
          DEFAULT: "#f56565",
          hover: "#e53e3e",
        },
      },
    },
  },
  plugins: [],
};
