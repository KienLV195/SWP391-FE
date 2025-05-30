import React from "react";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";

const BloodInfoPage = () => {
  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        <section className="content-section">
          <h1 className="merriweather-title">TÀI LIỆU HIẾN MÁU</h1>
          <p className="merriweather-content">
            Đây là trang tài liệu và hướng dẫn, hoặc các thông tin liên quan đến
            hiến máu tại đây.
          </p>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BloodInfoPage;
