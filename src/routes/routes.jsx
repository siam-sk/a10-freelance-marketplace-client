import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Root from "../pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
        {
            index: true,
            path: "/",
            Component: Home,
        }
    ]
  },
]);

export default router;