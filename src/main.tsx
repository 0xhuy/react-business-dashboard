// ============================================================
// MAIN ENTRY
// ============================================================

// ===== Libs =====
import React from "react";
import ReactDOM from "react-dom/client";

// ===== Config =====
import "@/utils/i18n";

// ===== App =====
import App from "./App";

// ===== Styles =====
import "./index.css";

// ===== Render =====
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
