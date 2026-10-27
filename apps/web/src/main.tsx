import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./app/theme.css";
import { router } from "./app/router";

const root = document.getElementById("root");
if (!root) throw new Error("No existe #root en index.html");

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
