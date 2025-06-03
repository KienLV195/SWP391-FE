import "../../styles/components/Footer.scss";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io"; // Icon mũi tên cho danh mục
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa"; // Icon địa chỉ và điện thoại
import { MdEmail } from "react-icons/md"; // Icon email

// Hàm cuộn đến phần "Giới thiệu bệnh viện"
const scrollToHospitalInfo = () => {
  const hospitalInfoSection = document.querySelector(".hospital-info-section");
  if (hospitalInfoSection) {
    hospitalInfoSection.scrollIntoView({
      behavior: "smooth",
    });
  }
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <div className="footer-brand">Axiscare</div>
      </div>
      <div className="footer-column">
        <div className="footer-title">Danh mục</div>
        <div className="footer-item">
          <IoIosArrowForward className="footer-icon" />
          <button className="footer-link" onClick={scrollToHospitalInfo}>
            Về chúng tôi
          </button>
        </div>
        <div className="footer-item">
          <IoIosArrowForward className="footer-icon" />
          <Link to="/donation-guide" className="footer-link">
            Hướng dẫn hiến máu
          </Link>
        </div>
      </div>
      <div className="footer-column">
        <div className="footer-title">Liên hệ với chúng tôi</div>
        <div className="footer-item">
          <FaMapMarkerAlt className="footer-icon" />
          TP HCM - Viet Nam
        </div>
        <div className="footer-item">
          <MdEmail className="footer-icon" />
          <a href="mailto:vienhhtmtu@nihbt.org.vn" className="footer-link">
            vienhhtmtu@nihbt.org.vn
          </a>
        </div>
        <div className="footer-item">
          <FaPhone className="footer-icon" />
          (028) 3957 1342
        </div>
      </div>
    </footer>
  );
};

export default Footer;
