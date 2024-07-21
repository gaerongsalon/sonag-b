import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";

export default function RouteMain() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}
