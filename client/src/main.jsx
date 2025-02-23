import React from "react"
import ReactDOM from "react-dom/client"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import App from "./App.jsx"
import "./index.css"
import { FundlyProvider } from "./context/FundlyContext"



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FundlyProvider>
      <App />
      <ToastContainer position="bottom-right" />
    </FundlyProvider>
  </React.StrictMode>
)