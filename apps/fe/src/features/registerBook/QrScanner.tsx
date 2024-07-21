import * as server from "../../api/server.ts";

import Html5QrcodePlugin from "../../plugin/barcode/Html5QrcodeScannerPlugin.tsx";
import React from "react";
import promiseNotification from "../../support/promiseNotification.ts";

export default function QrScanner() {
  const [isbn, setIsbn] = React.useState("");
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (isbn) {
      promiseNotification(server.getTitleByIsbn({ isbn }), {
        onSuccess: ({ title }) => {
          setTitle(title);
        },
        buildSuccessMessage: () => null,
      });
    }
  }, [isbn]);

  return (
    <>
      <Html5QrcodePlugin
        fps={10}
        qrbox={420}
        disableFlip={true}
        qrCodeErrorCallback={(error) => {
          console.error(error);
        }}
        qrCodeSuccessCallback={(result) => {
          console.info(result);
          setIsbn(result);
        }}
      />
      <p className="read-the-docs">
        [{isbn}] {title || "..."}
      </p>
    </>
  );
}
