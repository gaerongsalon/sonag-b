import Html5QrcodePlugin from "../../plugin/barcode/Html5QrcodeScannerPlugin.tsx";

export default function QrScanner({
  onComplete,
}: {
  onComplete: (isbn: string) => void;
}) {
  return (
    <Html5QrcodePlugin
      key="QrScanner"
      fps={5}
      qrbox={500}
      disableFlip={true}
      qrCodeErrorCallback={(error) => {
        console.error(error);
      }}
      qrCodeSuccessCallback={(result) => {
        console.info(result);
        onComplete(result);
      }}
    />
  );
}
