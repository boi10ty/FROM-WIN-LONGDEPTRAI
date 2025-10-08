import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./pages/index.jsx";
import TwoStepVerification from "./pages/two-step-verification.jsx";
import "./assets/css/index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        ></link>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="two-step-verification"
            element={<TwoStepVerification />}
          />
        </Routes>
      </>
    </BrowserRouter>
  </React.StrictMode>,
);
