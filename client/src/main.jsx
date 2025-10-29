import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// importing provider component from react redux
import { Provider } from "react-redux";
// importing store configuration we created
import appStore from "./utils/appStore.js";

// importing routing components
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body.jsx";
import VideoPlayerPage from "./components/VideoPlayerPage.jsx";
import ChannelPage from "./components/ChannelPage.jsx";

// ****************************** REACT ROUTER CONFIGURATION ******************************

// Define the routes for our application.
// It takes an array of objects.
const appRouter = createBrowserRouter([
  {
    // The parent path is the root path (/)
    path: "/",
    // The element for the root path is the App component, which will act as the layout wrapper.
    element: <App />,
    // The children array defines the components that will replace the <Outlet /> inside App.
    children: [
      {
        // Path '/' (Home Page)
        path: "/",
        // The Body component (Sidebar + Video Grid) is the home page content.
        element: <Body />,
      },
      {
        // Dynamic route for the Video Player Page.
        path: "watch/:videoId",
        // The video player page component
        element: <VideoPlayerPage />,
      },
      // 2. NEW: Dynamic route for the Channel Page.
      // The ':handle' segment captures the channel's unique handle.
      {
        path: "channel/:handle",
        element: <ChannelPage />,
      },
    ],
  },
]);

// ****************************** RENDER THE APPLICATION ******************************
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>
);
