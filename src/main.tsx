import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FormulaireDenregistrement from "./pages/FormulaireDenregistrement";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FormulaireDenregistrement></FormulaireDenregistrement>
  </StrictMode>
);
