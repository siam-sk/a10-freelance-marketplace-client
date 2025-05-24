import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login"; 
import Signup from "../pages/Signup"; 
import AddTask from "../pages/AddTask";
import PrivateRoute from "./PrivateRoute";
import BrowseTask from "../pages/BrowseTask";
import TaskDetail from "../pages/TaskDetail";
import MyPostedTasks from "../pages/MyPostedTasks";
import UpdateTask from "../pages/UpdateTask";

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
        path: "add-task",
        element: (
          <PrivateRoute>
            <AddTask />
          </PrivateRoute>
        ),
      },
      {
        path: "browse-tasks", 
        element: <BrowseTask />,
      },
      {
        path: "task/:taskId", 
        element: (
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "my-tasks",
        element: (
          <PrivateRoute>
            <MyPostedTasks />
          </PrivateRoute>
        ),
      },
      {
        path: "update-task/:taskId",
        element: (
          <PrivateRoute>
            <UpdateTask />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;