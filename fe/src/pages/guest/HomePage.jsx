import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiShield,
  FiAward,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";
import { Table, Row, Col, Card } from "antd";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import blood1 from "../../assets/images/blood1.jpg";
import hospitalImg from "../../assets/images/hospital.jpg";
import "../../styles/pages/HomePage.scss";

const GuestHomePage = () => {
  const [emergencyRequests, setEmergencyRequests] = useState([]);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        key: "req1",
        bloodType: "O+",
        quantity: 2,
        note: "Bệnh viện Chợ Rẫy. Cần gấp cho ca phẫu thuật tim. Độ khẩn cấp: Rất khẩn cấp. (Đăng ngày: 10/07/2024)",
        id_internal: 1,
        location: "Bệnh viện Chợ Rẫy",
        urgency: "Rất khẩn cấp",
        details: "Cần gấp 2 đơn vị máu O+",
        details_original: "Cần gấp 2 đơn vị máu O+ cho ca phẫu thuật tim.",
        postedDate: "10/07/2024",
      },
      {
        id: 2,
        key: "req2",
        bloodType: "A-",
        quantity: 1,
        note: "Bệnh viện Nhi Đồng 1. Bé gái 5 tuổi cần máu A- để điều trị bệnh hiểm nghèo. Độ khẩn cấp: Khẩn cấp. (Đăng ngày: 09/07/2024)",
        id_internal: 2,
        location: "Bệnh viện Nhi Đồng 1",
        urgency: "Khẩn cấp",
        details: "Bé gái 5 tuổi cần máu A-",
        details_original:
          "Bé gái 5 tuổi cần máu A- để điều trị bệnh hiểm nghèo.",
        postedDate: "09/07/2024",
      },
      {
        key: "req3",
        bloodType: "B+",
        quantity: 3,
        note: "Bệnh viện Truyền máu Diarrhea. Cần cho bệnh nhân Thalassemia. Độ khẩn cấp: Cao. (Đăng ngày: 11/07/2024)",
        id_internal: 3,
        location: "Bệnh viện Truyền máu Diarrhea",
        urgency: "Cao",
        details: "Cần cho bệnh nhân Thalassemia",
        details_original:
          "Cần cho bệnh nhân Thalassemia, ưu tiên người đã hiến nhắc lại.",
        postedDate: "11/07/2024",
      },
    ];

    setEmergencyRequests(fakeData);
  }, []);

  const achievementData = [
    {
      icon: <FiShield className="achievement-icon" />,
      title: "AN TOÀN",
      description:
        "Hơn 10.000 đơn vị máu được tiếp nhận và phân phối an toàn mỗi năm",
      color: "red",
    },
    {
      icon: <FiAward className="achievement-icon" />,
      title: "TIÊN PHONG",
      description:
        "Tiên phong triển khai hệ thống kết nối hiến - nhận máu trực tuyến nhanh chóng, hiệu quả",
      color: "blue",
    },
    {
      icon: <FiShare2 className="achievement-icon" />,
      title: "PHỔ BIẾN",
      description:
        "Mạng lưới hơn 20.000 người hiến máu thường xuyên trên cả nước",
      color: "red",
    },
    {
      icon: <FiTrendingUp className="achievement-icon" />,
      title: "HIỆN ĐẠI",
      description:
        "Ứng dụng công nghệ hiện đại trong lưu trữ và truy xuất hồ sơ người hiến máu",
      color: "blue",
    },
  ];

  const columns = [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      filters: [
        { text: "O+", value: "O+" },
        { text: "O-", value: "O-" },
        { text: "A+", value: "A+" },
        { text: "A-", value: "A-" },
        { text: "B+", value: "B+" },
        { text: "B-", value: "B-" },
        { text: "AB+", value: "AB+" },
        { text: "AB-", value: "AB-" },
      ],
      onFilter: (value, record) => record.bloodType.includes(value),
      sorter: (a, b) => a.bloodType.localeCompare(b.bloodType),
      width: "15%",
      render: (bloodType) => {
        const isPositive = bloodType.includes("+");
        const badgeClass = isPositive ? "positive" : "negative";

        return (
          <span
            className={`blood-type-badge ${badgeClass}`}
            data-blood-type={bloodType}
          >
            {bloodType}
          </span>
        );
      },
    },
    {
      title: "Số lượng (đv)",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "15%",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Link to="/login" className="cta-button tertiary table-action-button">
          Hỗ trợ
        </Link>
      ),
      width: "150px",
      align: "center",
    },
  ];

  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        {/* Hero Section */}
        <section
          className="hero-section"
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
            <div className="hero-image">
              <div className="hero-image-bg"></div>
              <img src={blood1} alt="Truyền máu" className="hero-img" />
            </div>
          </div>
        </section>

        {/* Hospital Info */}
        <section className="hospital-info-section">
          <div className="hospital-left">
            <div className="hospital-img-box">
              <img
                src={hospitalImg}
                alt="Bệnh viện Ánh Dương"
                className="hospital-img"
              />
            </div>
          </div>
          <div className="hospital-right">
            <h3 className="hospital-title">GIỚI THIỆU VỀ CHÚNG TÔI</h3>
            <h2 className="hospital-name">Bệnh viện Đa khoa Ánh Dương</h2>
            <p className="hospital-desc">
              Đơn vị y tế hàng đầu, cam kết cung cấp dịch vụ chăm sóc sức khỏe
              chất lượng cao. Với cơ sở vật chất hiện đại, đội ngũ chuyên môn
              giàu kinh nghiệm và quy trình minh bạch, chúng tôi luôn là điểm
              tựa vững chắc cho cộng đồng.
            </p>
            <p className="hospital-desc">
              Đặc biệt chú trọng xây dựng và vận hành hệ thống tiếp nhận, điều
              phối máu tiên tiến. Nguồn máu được hiến tặng không chỉ phục vụ nhu
              cầu điều trị nội bộ mà còn sẵn sàng hỗ trợ các bệnh nhân có nhu
              cầu, góp phần cứu sống nhiều sinh mạng. Ánh Dương tự hào là cầu
              nối tin cậy giữa lòng nhân ái và sự sống.
            </p>
            <ul className="hospital-contact">
              <li>
                <FiPhone className="icon phone" /> (028) 3957 1343
              </li>
              <li>
                <FiMail className="icon email" /> anhduonghospital@gmail.com
              </li>
              <li>
                <FiMapPin className="icon address" /> 123 Đường ABC, Quận 1, TP.
                Hồ Chí Minh
              </li>
              <li>
                <FiClock className="icon clock" /> Thứ 2 - Chủ nhật: 07:00 -
                12:00, Chiều: 13:00 - 16:30
              </li>
            </ul>
          </div>
        </section>

        {/* Emergency Requests */}
        <section className="emergency-section">
          <div className="section-title-wrapper">
            <h2 className="section-title merriweather-title">
              YÊU CẦU HIẾN MÁU KHẨN CẤP
            </h2>
          </div>
          <Table
            columns={columns}
            dataSource={emergencyRequests}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </section>

        {/* Achievement Section */}
        <section className="achievement-section">
          <div className="achievement-container">
            <div className="achievement-header">
              <div className="achievement-line"></div>
              <h3 className="achievement-subtitle">THÀNH TỰU NỔI BẬT</h3>
            </div>
            <h2 className="achievement-title merriweather-title">
              THÀNH TỰU CỦA CHÚNG TÔI
            </h2>

            <Row gutter={[24, 24]} className="achievement-grid">
              {achievementData.map((item, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    className={`achievement-card achievement-card-${item.color}`}
                  >
                    <div className="achievement-icon-wrapper">{item.icon}</div>
                    <h3 className="achievement-card-title">{item.title}</h3>
                    <p className="achievement-card-desc">{item.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default GuestHomePage;
