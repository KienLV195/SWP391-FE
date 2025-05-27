import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./HomePage.scss";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import blood1 from "../../assets/images/blood1.jpg";
import blood2 from "../../assets/images/blood2.jpg";
import blood3 from "../../assets/images/blood3.jpg";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

// Dữ liệu giả lập
const hospitalInfo = {
  name: "Bệnh viện An Dương",
  address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  phone: "(028) 3957 1343",
  email: "anhduonghospital@gmail.com",
  hours: "Thứ 2 - Chủ nhật: 07:00 - 12:00, Chiều: 13:00 - 16:30",
};

const GuestHomePage = () => {
  return (
    <div className="guest-home-page">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <Swiper
          pagination={{ dynamicBullets: true }}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="hero-swiper"
        >
          <SwiperSlide>
            <div className="hero-slide">
              <img src={blood1} alt="Truyền máu 1" className="hero-img" />
              <div className="hero-content">
                <h1 className="merriweather-title">
                  HIẾN MÁU CỨU NGƯỜI
                  <br />
                  NHẬN MÁU CỨU MÌNH
                </h1>
                <p className="merriweather-content">
                  Dù bạn là người cho hay người cần, chúng tôi luôn sẵn sàng kết
                  nối sự sống bằng từng giọt máu yêu thương.
                </p>
                <div className="cta-row">
                  <Link to="/register" className="cta-button">
                    ĐĂNG KÝ HIẾN MÁU
                  </Link>
                  <Link to="/receive" className="cta-button secondary">
                    ĐĂNG KÝ NHẬN MÁU
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-slide">
              <img src={blood2} alt="Truyền máu 2" className="hero-img" />
              <div className="hero-content">
                <h1 className="merriweather-title">
                  HIẾN MÁU CỨU NGƯỜI
                  <br />
                  NHẬN MÁU CỨU MÌNH
                </h1>
                <p className="merriweather-content">
                  Dù bạn là người cho hay người cần, chúng tôi luôn sẵn sàng kết
                  nối sự sống bằng từng giọt máu yêu thương.
                </p>
                <div className="cta-row">
                  <Link to="/register" className="cta-button">
                    ĐĂNG KÝ HIẾN MÁU
                  </Link>
                  <Link to="/receive" className="cta-button secondary">
                    ĐĂNG KÝ NHẬN MÁU
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="hero-slide">
              <img src={blood3} alt="Truyền máu 3" className="hero-img" />
              <div className="hero-content">
                <h1 className="merriweather-title">
                  HIẾN MÁU CỨU NGƯỜI
                  <br />
                  NHẬN MÁU CỨU MÌNH
                </h1>
                <p className="merriweather-content">
                  Dù bạn là người cho hay người cần, chúng tôi luôn sẵn sàng kết
                  nối sự sống bằng từng giọt máu yêu thương.
                </p>
                <div className="cta-row">
                  <Link to="/register" className="cta-button">
                    ĐĂNG KÝ HIẾN MÁU
                  </Link>
                  <Link to="/receive" className="cta-button secondary">
                    ĐĂNG KÝ NHẬN MÁU
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Hospital Info Section */}
      <section className="hospital-info-section">
        <div className="hospital-container">
          <div className="hospital-left">
            <h3 className="hospital-title">GIỚI THIỆU VỀ CHÚNG TÔI</h3>
            <h2 className="hospital-name">Bệnh viện Đa khoa Ánh Dương</h2>
            <p className="hospital-desc">
              Bệnh viện Đa khoa Ánh Dương là đơn vị y tế hàng đầu, cam kết cung
              cấp dịch vụ chăm sóc sức khỏe chất lượng cao. Với cơ sở vật chất
              hiện đại, đội ngũ chuyên môn giàu kinh nghiệm và quy trình minh
              bạch, chúng tôi luôn là điểm tựa vững chắc cho cộng đồng.
              <br />
              <br />
              Bệnh viện đa khoa Ánh Dương đặc biệt chú trọng xây dựng và vận
              hành hệ thống tiếp nhận, điều phối máu tiên tiến. Nguồn máu được
              hiến tặng không chỉ phục vụ nhu cầu điều trị nội bộ mà còn sẵn
              sàng hỗ trợ các bệnh nhân có nhu cầu, góp phần cứu sống nhiều sinh
              mạng. Ánh Dương tự hào là cầu nối tin cậy giữa lòng nhân ái và sự
              sống.
            </p>
            <ul className="hospital-contact">
              <li>
                <FiPhone className="icon phone" /> {hospitalInfo.phone}
              </li>
              <li>
                <FiMail className="icon email" /> {hospitalInfo.email}
              </li>
              <li>
                <FiMapPin className="icon address" /> {hospitalInfo.address}
              </li>
              <li>
                <FiClock className="icon clock" /> {hospitalInfo.hours}
              </li>
            </ul>
          </div>
        </div>
        <div className="hospital-right">
          <div className="hospital-img-box">
            {/* Chèn ảnh bệnh viện hoặc ảnh minh họa tại đây */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GuestHomePage;
