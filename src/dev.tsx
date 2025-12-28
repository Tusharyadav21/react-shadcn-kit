import React from "react";
import { createRoot } from "react-dom/client";
import { Demo } from "./demo";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Demo />
    </React.StrictMode>,
  );
}
