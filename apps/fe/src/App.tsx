import "./App.css";
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";

import Html5QrcodePlugin from "./plugin/barcode/Html5QrcodeScannerPlugin";
import reactLogo from "./assets/react.svg";
import { useState } from "react";
import viteLogo from "/vite.svg";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState("");

  return (
    <>
      <MantineProvider theme={theme}>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">{code}</p>
        <Html5QrcodePlugin  
          fps={10}
          qrbox={500}
          disableFlip={true}
          qrCodeErrorCallback={(error) => {
            console.error(error);
          }}
          qrCodeSuccessCallback={(result) => {
            console.info(result);
            setCode(result);
          }}
        />
      </MantineProvider>
    </>
  );
}

export default App;
