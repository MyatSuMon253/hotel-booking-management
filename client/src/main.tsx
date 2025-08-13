import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import client from "./apollo/apolloClient.ts";
import Layout from "./components/layout/layout.tsx";
import DetailPage from "./components/pages/DetailPage.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/room/:id",
        element: <DetailPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </ApolloProvider>
  </StrictMode>
);
