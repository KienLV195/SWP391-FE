import React from "react";
import GuestHomePage from "../guest/GuestHomePage";
import MemberNavbar from "../../components/member/MemberNavbar";

const MemberHomePage = () => {
  return (
    <>
      <MemberNavbar />
      <GuestHomePage hideNavbar />
    </>
  );
};

export default MemberHomePage;
