import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@patternfly/react-core/dist/styles/base.css";
import "./index.css";
import App from "./app.tsx";
import { applyThemePreference, readThemePreference } from "./theme-preference";

applyThemePreference(readThemePreference());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
