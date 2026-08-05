import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single-page app served at the domain root — no rewrites needed.
export default defineConfig({
  plugins: [react()],
});
