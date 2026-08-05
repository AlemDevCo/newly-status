/**
 * src/main.jsx — entry for the standalone Newly status page (status.newly.gg).
 */
import React from "react";
import { createRoot } from "react-dom/client";
import StatusPage from "./StatusPage";

createRoot(document.getElementById("status-root")).render(
  <React.StrictMode>
    <StatusPage />
  </React.StrictMode>
);
