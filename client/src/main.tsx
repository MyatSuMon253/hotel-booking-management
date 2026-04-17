import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";

import client from "./apollo/apolloClient.ts";
import DetailPage from "./components/pages/DetailPage.tsx";
import HomePage from "./components/pages/HomePage.tsx";
import LoginPage from "./components/pages/LoginPage.tsx";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import ProtectPage from "./components/pages/ProtectPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import "./index.css";
import ResetPasswordPage from "./components/pages/ResetPasswordPage.tsx";
import ForgetPasswordPage from "./components/pages/ForgetPasswordPage.tsx";
import PaymentPage from "./components/pages/Payment.tsx";
import Bookings from "./components/pages/Bookings.tsx";
import InvoiceApp from "./components/invoice/Invoice.tsx";
import Dashboard from "./components/admin/dashboard/Dashboard.tsx";
import Layout from "./components/layout/Layout.tsx";
import ManageRoom from "./components/pages/ManageRoom.tsx";
import CreateRoom from "./components/admin/room/CreateRoom.tsx";
import UpdateRoom from "./components/admin/room/UpdateRoom.tsx";
import BookingList from "./components/admin/booking/BookingList.tsx";
import ReviewList from "./components/admin/review/ReviewList.tsx";

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
        path: "/admin/dashboard",
        element: (
          <ProtectPage roles={["admin"]}>
            <Dashboard />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms/create",
        element: (
          <ProtectPage roles={["admin"]}>
            <CreateRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms/edit/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <UpdateRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/bookings",
        element: (
          <ProtectPage roles={["admin"]}>
            <BookingList />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/reviews",
        element: (
          <ProtectPage roles={["admin"]}>
            <ReviewList />
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
      {
        path: "/invoice/:id",
        element: (
          <ProtectPage>
            <InvoiceApp />
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
