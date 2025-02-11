import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: "VITE_", // Ensures .env variables with "VITE_" prefix are loaded
});
