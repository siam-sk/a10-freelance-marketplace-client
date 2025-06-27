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
        loader: () => {
          document.title = 'Home | TalentSphere';
          return null; 
        },
      },
      {
        path: "login",
        element: <Login />,
        loader: () => {
          document.title = 'Login | TalentSphere';
          return null;
        },
      },
      {
        path: "signup",
        element: <Signup />,
        loader: () => {
          document.title = 'Sign Up | TalentSphere';
          return null;
        },
      },
      {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
          { index: true, element: <DashboardOverview />, loader: () => { document.title = 'Dashboard | TalentSphere'; return null; } },
          { path: "all-tasks", element: <AllTasksTable />, loader: () => { document.title = 'All Tasks | TalentSphere'; return null; } },
          { path: "my-tasks", element: <MyPostedTasks />, loader: () => { document.title = 'My Posted Tasks | TalentSphere'; return null; } },
          { path: "add-task", element: <AddTask />, loader: () => { document.title = 'Add New Task | TalentSphere'; return null; } },
          { path: "my-bids", element: <MyBids />, loader: () => { document.title = 'My Bids | TalentSphere'; return null; } },
        ],
      },
      {
        path: "browse-tasks",
        element: <BrowseTasks />,
        loader: () => {
          document.title = 'Browse Tasks | TalentSphere';
          return null;
        },
      },
      {
        path: "about-us",
        element: <AboutUs />,
        loader: () => {
          document.title = 'About Us | TalentSphere';
          return null;
        },
      },
      {
        path: "contact",
        element: <Contact />,
        loader: () => {
          document.title = 'Contact Us | TalentSphere';
          return null;
        },
      },
      {
        path: "task/:taskId",
        element: <TaskDetail />,
        loader: async ({ params }) => {
          const response = await fetch(`https://a10-freelance-marketplace-server.vercel.app/tasks/${params.taskId}`);
          const task = await response.json();
          document.title = `${task.title} | TalentSphere`;
          return task; 
        },
      },
      {
        path: "my-tasks",
        element: (
          <PrivateRoute>
            <MyPostedTasks />
          </PrivateRoute>
        ),
        loader: () => {
          document.title = 'My Posted Tasks | TalentSphere';
          return null;
        },
      },
    ],
  },
]);

export default router;