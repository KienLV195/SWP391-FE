import "../../styles/components/Footer.scss";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa"; // Icon địa chỉ và điện thoại
import { MdEmail } from "react-icons/md"; // Icon email

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <div className="footer-brand">Axiscare</div>
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
