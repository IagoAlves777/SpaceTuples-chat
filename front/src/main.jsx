import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import IdProvider from "./context/IdContext";
import ChatProvider from "./context/chatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <IdProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </IdProvider>
    </BrowserRouter>
  </React.StrictMode>
);
