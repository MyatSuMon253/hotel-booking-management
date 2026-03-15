import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import client from "./apollo/apolloClient.ts";
import Layout from "./components/layout/layout.tsx";
import DashboardPage from "./components/pages/DashboardPage.tsx";
import DetailPage from "./components/pages/DetailPage.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import LoginPage from "./components/pages/LoginPage.tsx";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import ProtectPage from "./components/pages/ProtectPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import "./index.css";
import ResetPasswordPage from "./components/pages/ResetPasswordPage.tsx";
import ForgetPassword from "./components/profile/ForgetPassword.tsx";
import ForgetPasswordPage from "./components/pages/ForgetPasswordPage.tsx";
import PaymentPage from "./components/pages/payment.tsx";
import Bookings from "./components/pages/Bookings.tsx";

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
        path: "/rooms/:id",
        element: <DetailPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/profile",
        element: (
          <ProtectPage>
            <ProfilePage />
          </ProtectPage>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectPage roles={["admin"]}>
            <DashboardPage />
          </ProtectPage>
        ),
      },
      { path: "/reset", element: <ForgetPasswordPage /> },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "/bookings/:id/payment",
        element: (
          <ProtectPage>
            <PaymentPage />
          </ProtectPage>
        ),
      },
      {
        path: "/bookings",
        element: (
          <ProtectPage>
            <Bookings />
          </ProtectPage>
        ),
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
  </StrictMode>,
);
