import React from "react";
import BloodDonationGuide from "../guest/DonationGuide";
import MemberNavbar from "../../components/member/MemberNavbar";

const MemberDonationGuide = () => {
  return (
    <>
      <MemberNavbar />
      <BloodDonationGuide hideNavbar />
    </>
  );
};

export default MemberDonationGuide;
