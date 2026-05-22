// ============================================================
// MAIN ENTRY
// ============================================================

// ===== Libs =====
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// ===== App =====
import App from "./App";

// ===== Others =====
import store from "@/redux/store";
import "@/utils/i18n";

// ===== Styles =====
import "./index.css";

// ===== Render =====
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
