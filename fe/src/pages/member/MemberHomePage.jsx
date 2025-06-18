import React from "react";
import { Link } from "react-router-dom";
import GuestHomePage from "../guest/GuestHomePage";
import MemberNavbar from "../../components/member/MemberNavbar";
import authService from "../../services/authService";
import { getUserName } from "../../utils/userUtils";
import blood1 from "../../assets/images/blood1.jpg";
import "../../styles/pages/MemberHomePage.scss";

const MemberHomePage = () => {
  const user = authService.getCurrentUser();
  const userName = getUserName();

  // Lấy thông tin nhóm máu từ hồ sơ cá nhân
  const getBloodTypeInfo = () => {
    // Thử lấy từ localStorage trước
    const storedInfo = JSON.parse(localStorage.getItem("memberInfo") || "{}");

    // Lấy từ user profile hoặc storedInfo
    const bloodGroup = user?.profile?.bloodGroup || storedInfo.bloodGroup || "";
    const rhType = user?.profile?.rhType || storedInfo.rhType || "";

    // Nếu có cả bloodGroup và rhType thì kết hợp lại
    if (bloodGroup && rhType) {
      return `${bloodGroup}-${rhType}`;
    }
    // Nếu chỉ có bloodGroup
    else if (bloodGroup) {
      return bloodGroup;
    }
    // Nếu không có thông tin
    else {
      return "Chưa xác định";
    }
  };

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
            CHÀO MỪNG, {userName.toUpperCase()}
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
                {getBloodTypeInfo()}
              </span>
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
