import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WindowSizeProvider } from "./utils/context/windowSize";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <WindowSizeProvider>
      <App />
    </WindowSizeProvider>
  </React.StrictMode>
);
