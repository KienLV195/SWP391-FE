import React from "react";
import { useParams } from "react-router-dom";
import UserManagement from "./UserManagement";

const UserManagementWrapper = () => {
  const { userType } = useParams();

  // Default to members if no userType is provided
  const defaultUserType = userType || "members";

  return <UserManagement userType={defaultUserType} />;
};

export default UserManagementWrapper;
