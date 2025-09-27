import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Router from "./routes/Router";
import { GlobalStyle } from "./styles/GlobalStyles";

const router = createBrowserRouter(Router);

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
