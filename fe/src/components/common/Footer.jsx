import "../../styles/components/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">Axiscare</div>
      <div className="footer-content">
        © 2025 Axiscare. All rights reserved.
      </div>
      <div className="footer-content">
        Contact:{" "}
        <a href="mailto:contact@axiscare.com" className="footer-link">
          contact@axiscare.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
