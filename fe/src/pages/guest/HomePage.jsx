import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { Table } from "antd";
import Header from "../../components/common/Header";
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
        details: "Cần gấp 2 đơn vị máu O+ cho ca phẫu thuật tim.",
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
        details: "Bé gái 5 tuổi cần máu A- để điều trị bệnh hiểm nghèo.",
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
        details:
          "Cần cho bệnh nhân Thalassemia, ưu tiên người đã hiến nhắc lại.",
        details_original:
          "Cần cho bệnh nhân Thalassemia, ưu tiên người đã hiến nhắc lại.",
        postedDate: "11/07/2024",
      },
    ];

    setEmergencyRequests(fakeData);
  }, []);

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
      title: "Thông tin chi tiết & Địa điểm",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Link
          to={`/requests/${record.id_internal}`}
          className="cta-button tertiary table-action-button"
        >
          Hỗ trợ
        </Link>
      ),
      width: "150px",
      align: "center",
    },
  ];

  return (
    <div className="guest-home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="merriweather-title">
              HIẾN MÁU CỨU NGƯỜI
              <br />
              NHẬN MÁU CỨU MÌNH
            </h1>
            <p className="merriweather-content">
              Dù bạn là người cho hay người cần, chúng tôi luôn sẵn sàng kết nối
              sự sống bằng từng giọt máu yêu thương.
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
        <h2 className="section-title merriweather-title">
          YÊU CẦU HIẾN MÁU KHẨN CẤP
        </h2>
        <div className="requests-grid">
          {emergencyRequests.map((request) => (
            <div key={request.key} className="request-card">
              <h3 className="request-blood-type">
                Nhóm máu: {request.bloodType}
              </h3>
              <p className="request-location">
                <FiMapPin /> {request.location}
              </p>
              <p className="request-urgency">Độ khẩn cấp: {request.urgency}</p>
              <p className="request-details">{request.details}</p>
              <p className="request-date">
                <FiClock /> Ngày đăng: {request.postedDate}
              </p>
              <Link
                to={`/requests/${request.id_internal}`}
                className="cta-button tertiary"
              >
                Xem chi tiết & Hỗ trợ
              </Link>
            </div>
          ))}
        </div>

        <Table
          columns={columns}
          dataSource={emergencyRequests}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </section>

      <Footer />
    </div>
  );
};

export default GuestHomePage;
