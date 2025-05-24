import { createBrowserRouter } from "react-router"; // Corrected import
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login"; // Import Login page
import Signup from "../pages/Signup"; // Import Signup page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />, 
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login", // Route for Login page
        element: <Login />,
      },
      {
        path: "signup", // Route for Signup page
        element: <Signup />,
      },
      // Add other routes like /browse-tasks, /add-task, /my-tasks, /profile here
      // Example:
      // {
      //   path: "browse-tasks",
      //   element: <BrowseTasksPage />,
      // },
    ],
  },
]);

export default router;