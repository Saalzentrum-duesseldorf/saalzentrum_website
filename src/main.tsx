declare global {
  interface Window {
    global: any;
  }
}

if (typeof window.global === "undefined") {
  window.global = window;
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const password = "secretPassWd";
// if (prompt("Enter password:", "") === password) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
// }
