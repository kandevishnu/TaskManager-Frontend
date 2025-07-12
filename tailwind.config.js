/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // Enables dark mode via class
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
      colors: {
        priority: {
          low: "#dcfce7", // green-100
          medium: "#fef9c3", // yellow-100
          high: "#fee2e2", // red-100
        },
        status: {
          pending: "#a855f7", // purple-500
          "in-progress": "#3b82f6", // blue-500
          completed: "#22c55e", // green-500
        },
      },
      minHeight: {
        card: "14rem", // Ensures consistent card height
      },
    },
  },
  plugins: [require("@tailwindcss/forms")], // Optional: improves form styling
};
