import React from "react";
import GuestBloodInfoPage from "../guest/BloodInfoPage";
import MemberNavbar from "../../components/member/MemberNavbar";

const MemberBloodInfoPage = () => {
  return (
    <>
      <MemberNavbar />
      <GuestBloodInfoPage hideNavbar />
    </>
  );
};

export default MemberBloodInfoPage;
