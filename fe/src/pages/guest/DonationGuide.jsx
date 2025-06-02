import React from "react";
import "../../styles/pages/DonationGuide.scss";
import GuestNavbar from "../../components/guest/GuestNavbar";

import Footer from "../../components/common/Footer";

const BloodDonationGuide = () => {
  const guideSteps = [
    {
      step: 1,
      title: "Đăng ký hiến máu",
      content:
        "Đăng ký trực tuyến hoặc tại các điểm hiến máu được chỉ định. Đảm bảo bạn đã kiểm tra các điều kiện sức khỏe trước khi đăng ký.",
      image: "path/to/image1.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      step: 2,
      title: "Kiểm tra sức khỏe",
      content:
        "Tại điểm hiến máu, bạn sẽ được kiểm tra sức khỏe cơ bản như đo huyết áp, kiểm tra hemoglobin để đảm bảo đủ điều kiện hiến máu.",
      image: "path/to/image2.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      step: 3,
      title: "Hiến máu",
      content:
        "Quy trình hiến máu diễn ra trong khoảng 5-10 phút. Bạn sẽ được nhân viên y tế hỗ trợ trong suốt quá trình.",
      image: "path/to/image3.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      step: 4,
      title: "Nghỉ ngơi và hồi phục",
      content:
        "Sau khi hiến máu, nghỉ ngơi ít nhất 10 phút, uống nước và ăn nhẹ để hồi phục sức khỏe. Tránh vận động mạnh trong 24 giờ.",
      image: "path/to/image4.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
    {
      step: 5,
      title: "Nhận giấy chứng nhận",
      content:
        "Bạn sẽ nhận giấy chứng nhận hiến máu sau khi hoàn tất quy trình. Giấy này có giá trị trong các trường hợp cần thiết.",
      image: "path/to/image5.jpg", // Thay bằng đường dẫn ảnh thực tế
    },
  ];

  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        <section className="donation-guide-section">
          <div className="guide-header">
            <div className="guide-title-wrapper">
              <span className="guide-line"></span>
              <h1 className="merriweather-title">HƯỚNG DẪN HIẾN MÁU</h1>
              <span className="guide-line"></span>
            </div>
          </div>
          {guideSteps.map((step, index) => (
            <section
              key={step.step}
              className={`guide-step-section ${
                index % 2 === 0 ? "even" : "odd"
              } ${index % 2 === 0 ? "light-bg" : "dark-bg"}`}
            >
              <div className="step-content">
                <div className="step-number">{step.step}</div>
                <div className="step-details">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-content-text">{step.content}</p>
                </div>
              </div>
              <div className="step-image">
                <img src={step.image} alt={`Step ${step.step}`} />
              </div>
            </section>
          ))}
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BloodDonationGuide;
