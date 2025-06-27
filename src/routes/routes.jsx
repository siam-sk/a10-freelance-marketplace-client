import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AddTask from "../pages/AddTask";
import PrivateRoute from "./PrivateRoute";
import BrowseTasks from "../pages/BrowseTask";
import TaskDetail from "../pages/TaskDetail";
import MyPostedTasks from "../pages/MyPostedTasks";
import Dashboard from "../pages/Dashboard";
import DashboardOverview from "../pages/DashboardOverview";
import MyBids from "../pages/MyBids";
import AllTasksTable from "../pages/AllTasksTable";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";

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
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: "all-tasks", element: <AllTasksTable /> },
          { path: "my-tasks", element: <MyPostedTasks /> },
          { path: "add-task", element: <AddTask /> },
          { path: "my-bids", element: <MyBids /> },
        ],
      },
      {
        path: "browse-tasks",
        element: <BrowseTasks />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "task/:taskId",
        element: <TaskDetail />,
      },
      {
        path: "my-tasks",
        element: (
          <PrivateRoute>
            <MyPostedTasks />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;