import {
  isAuthenticatedVar,
  isLoadingVar,
  userInfoVar,
} from "@/apollo/apollo-vars";
import { useReactiveVar } from "@apollo/client";
import React from "react";
import { Navigate } from "react-router";
import Loader from "../common/Loader";

type ProtectPageProps = {
  roles?: string[];
  children: React.ReactNode;
};

const ProtectPage = ({ roles, children }: ProtectPageProps) => {
  const isLoading = useReactiveVar(isLoadingVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const userInfo = useReactiveVar(userInfoVar);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (roles && !roles.some((role: string) => userInfo?.role?.includes(role))) {
    return <Navigate to={"/"} />;
  }

  return <div>{children}</div>;
};

export default ProtectPage;
