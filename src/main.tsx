import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "@patternfly/react-core/dist/styles/base.css";
import "./index.css";
import { router } from "./router";
import { applyThemePreference, readThemePreference } from "./theme-preference";

applyThemePreference(readThemePreference());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
