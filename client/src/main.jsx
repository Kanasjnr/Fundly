import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./utils/theme";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "./context/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThirdwebProvider activeChain={"sepolia"} clientId="e311daccd3702e318c1c692e7edaff50"  >
    <React.StrictMode>
      <StateContextProvider>
      <ChakraProvider theme={customTheme}>
        <App />
      </ChakraProvider>
      </StateContextProvider>
    </React.StrictMode>
  </ThirdwebProvider>
);
