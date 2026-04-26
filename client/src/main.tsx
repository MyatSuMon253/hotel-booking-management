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
import PaymentConfirmation from "./components/pages/PaymentConfirmation.tsx";
import Bookings from "./components/pages/Bookings.tsx";
import InvoiceApp from "./components/invoice/Invoice.tsx";
import Dashboard from "./components/admin/dashboard/Dashboard.tsx";
import Layout from "./components/layout/Layout.tsx";
import UserLayout from "./components/layout/UserLayout.tsx";
import ManageRoom from "./components/pages/ManageRoom.tsx";
import ManageCustomer from "./components/pages/ManageCustomer.tsx";
import ManagePromotion from "./components/pages/ManagePromotion.tsx";
import ManageMembershipTier from "./components/pages/ManageMembershipTier.tsx";
import CreateRoom from "./components/admin/room/CreateRoom.tsx";
import UpdateRoom from "./components/admin/room/UpdateRoom.tsx";
import CreatePromotion from "./components/admin/promotion/CreatePromotion.tsx";
import UpdatePromotion from "./components/admin/promotion/UpdatePromotion.tsx";
import CreateMembershipTier from "./components/admin/membership-tier/CreateMembershipTier.tsx";
import UpdateMembershipTier from "./components/admin/membership-tier/UpdateMembershipTier.tsx";
import BookingList from "./components/admin/booking/BookingList.tsx";
import ReviewList from "./components/admin/review/ReviewList.tsx";
import CustomerDetail from "./components/admin/customer/CustomerDetail.tsx";
import ManageBuffetDinner from "./components/pages/ManageBuffetDinner.tsx";
import ManageBuffetBooking from "./components/pages/ManageBuffetBooking.tsx";
import BuffetDinnerForm from "./components/admin/buffet/BuffetDinnerForm.tsx";
import BuffetListPage from "./components/pages/BuffetListPage.tsx";
import BuffetDetailPage from "./components/pages/BuffetDetailPage.tsx";
import BuffetPaymentPage from "./components/pages/BuffetPaymentPage.tsx";
import BuffetConfirmationPage from "./components/pages/BuffetConfirmationPage.tsx";
import TouristAttractionsPage from "./components/pages/TouristAttractionsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <UserLayout>
            <HomePage />
          </UserLayout>
        ),
      },
      {
        path: "/rooms/:id",
        element: <DetailPage />,
      },
      {
        path: "/buffets",
        element: (
          <ProtectPage>
            <BuffetListPage />
          </ProtectPage>
        ),
      },
      {
        path: "/buffets/:id",
        element: (
          <ProtectPage>
            <BuffetDetailPage />
          </ProtectPage>
        ),
      },
      {
        path: "/attractions",
        element: (
          <UserLayout>
            <TouristAttractionsPage />
          </UserLayout>
        ),
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
            <UserLayout>
              <ProfilePage />
            </UserLayout>
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
        path: "/admin/customers",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageCustomer />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/customers/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <CustomerDetail />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/promotions",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManagePromotion />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/promotions/create",
        element: (
          <ProtectPage roles={["admin"]}>
            <CreatePromotion />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/promotions/edit/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <UpdatePromotion />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/buffet-dinners",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageBuffetDinner />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/buffet-dinners/create",
        element: (
          <ProtectPage roles={["admin"]}>
            <BuffetDinnerForm />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/buffet-dinners/edit/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <BuffetDinnerForm />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/buffet-bookings",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageBuffetBooking />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/membership-tiers",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageMembershipTier />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/membership-tiers/create",
        element: (
          <ProtectPage roles={["admin"]}>
            <CreateMembershipTier />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/membership-tiers/edit/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <UpdateMembershipTier />
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
        path: "/bookings/:id/confirmation",
        element: (
          <ProtectPage>
            <PaymentConfirmation />
          </ProtectPage>
        ),
      },
      {
        path: "/buffet-bookings/:id/payment",
        element: (
          <ProtectPage>
            <BuffetPaymentPage />
          </ProtectPage>
        ),
      },
      {
        path: "/buffet-bookings/:id/confirmation",
        element: (
          <ProtectPage>
            <BuffetConfirmationPage />
          </ProtectPage>
        ),
      },
      {
        path: "/bookings",
        element: (
          <ProtectPage>
            <UserLayout>
              <Bookings />
            </UserLayout>
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
