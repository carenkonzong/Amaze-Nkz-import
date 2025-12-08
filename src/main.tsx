import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NewDeclarationPage from "./pages/NewDeclarationPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NewDeclarationPage></NewDeclarationPage>
  </StrictMode>
);
