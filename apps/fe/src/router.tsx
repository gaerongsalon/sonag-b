import First from "./features/home/First.tsx";
import Home from "./features/home/Home.tsx";
import RegisterBook from "./features/registerBook/RegisterBook.tsx";
import ScanBarcode from "./features/registerBook/ScanBarcode.tsx";
import { createBrowserRouter } from "react-router-dom";
import paths from "./paths.ts";

const router = createBrowserRouter([
  {
    id: "root",
    path: paths.home,
    Component: Home,
    children: [
      {
        index: true,
        Component: First,
      },
      {
        path: paths.registerBook,
        Component: RegisterBook,
      },
      {
        path: paths.scanBook,
        Component: ScanBarcode,
      },
    ],
  },
]);

export default router;
