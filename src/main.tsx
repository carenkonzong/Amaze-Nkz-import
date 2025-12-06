import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NewDeclarationPage from "./pages/NewDeclarationPage";
import FormValidation from "./components/FormValidation";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NewDeclarationPage></NewDeclarationPage>
    <FormValidation />
  </StrictMode>
);
