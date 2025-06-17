import React from "react";
import { Link } from "react-router-dom";
import GuestHomePage from "../guest/GuestHomePage";
import MemberNavbar from "../../components/member/MemberNavbar";
import authService from "../../services/authService";
import blood1 from "../../assets/images/blood1.jpg";
import "../../styles/pages/MemberHomePage.scss";

const MemberHomePage = () => {
  const user = authService.getCurrentUser();

  // Custom hero section for members
  const MemberHeroSection = () => (
    <section
      className="hero-section member-hero"
      data-aos="fade-up"
      style={{
        backgroundImage: `url(${blood1})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="merriweather-title">
            CHÀO MỪNG, {user?.profile?.fullName?.toUpperCase()}
            <br />
            CÙNG CHIA SẺ YÊU THƯƠNG
          </h1>
          <p className="merriweather-content">
            Cảm ơn bạn đã tham gia cộng đồng hiến máu. Hãy chọn hành động phù
            hợp để góp phần cứu sống những sinh mạng quý giá.
          </p>
          <div className="cta-row">
            <Link to="/member/blood-donation-form" className="cta-button">
              ĐĂNG KÝ HIẾN MÁU
            </Link>
            <Link
              to="/member/blood-request-form"
              className="cta-button secondary"
            >
              ĐĂNG KÝ NHẬN MÁU
            </Link>
          </div>
          <div className="member-info">
            <div className="info-item">
              <span className="label">Nhóm máu:</span>
              <span className="blood-type-badge">
                {user?.profile?.bloodType || "Chưa xác định"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Số điện thoại:</span>
              <span>{user?.profile?.phone}</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={blood1} alt="Truyền máu" className="hero-img" />
        </div>
      </div>
    </section>
  );

  return (
    <GuestHomePage
      CustomNavbar={MemberNavbar}
      CustomHeroSection={MemberHeroSection}
    />
  );
};

export default MemberHomePage;
