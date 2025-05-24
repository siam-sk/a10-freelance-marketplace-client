import { createBrowserRouter } from "react-router"; // Ensure using react-router-dom
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login"; 
import Signup from "../pages/Signup"; 
import AddTask from "../pages/AddTask"; // Import the AddTask page
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component

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
        path: "login", 
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "add-task", // Define the route for adding a task
        element: (
          <PrivateRoute>
            <AddTask />
          </PrivateRoute>
        ),
      },
      // You might want to add a "My Tasks" page route as well
      // {
      //   path: "my-tasks",
      //   element: (
      //     <PrivateRoute>
      //       {/* Replace with your MyTasks component */}
      //       <div>My Posted Tasks Page (Placeholder)</div> 
      //     </PrivateRoute>
      //   ),
      // },
      
    ],
  },
]);

export default router;