import React from "react";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";

const BloodDonationGuide = () => {
  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        <section className="content-section">
          <h1 className="merriweather-title">HƯỚNG DẪN HIẾN MÁU</h1>
          <p className="merriweather-content">
            Đây là trang hướng dẫn hiến máu nội dung hướng dẫn, quy trình, hoặc
            các thông tin liên quan đến hiến máu tại đây.
          </p>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BloodDonationGuide;
