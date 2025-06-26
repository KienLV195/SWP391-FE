import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { FiShield, FiAward, FiShare2, FiTrendingUp } from "react-icons/fi";
import { Table, Row, Col, Card, Collapse, Pagination, Carousel } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/guest/FooterGuest";
import authService from "../../services/authService";
import blood1 from "../../assets/images/blood1.jpg";
import hospitalImg from "../../assets/images/hospital.jpg";
import "../../styles/pages/GuestHomePage.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "../../components/common/ScrollToTop";
import { fetchAllNews } from "../../services/newsService";

const { Panel } = Collapse;

const GuestHomePage = ({ CustomNavbar, hideNavbar, CustomHeroSection }) => {
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const [newsData, setNewsData] = useState([]);

  const faqData = [
    {
      id: 1,
      question: "Ai có thể tham gia hiến máu?",
      answer: (
        <ul>
          <li>
            Công dân từ 18 đến 60 tuổi, có cân nặng ≥ 45kg, tình nguyện và đủ
            sức khỏe.
          </li>
          <li>Khoảng cách giữa hai lần hiến máu là ít nhất 12 tuần.</li>
          <li>
            Không mắc hoặc có hành vi nguy cơ lây truyền các bệnh qua đường máu.
          </li>
          <li>Cần mang theo giấy tờ tùy thân khi đi hiến máu.</li>
        </ul>
      ),
    },
    {
      id: 2,
      question: "Ai không nên hiến máu?",
      answer: (
        <ul>
          <li>Người nhiễm HIV, viêm gan B/C hoặc có hành vi nguy cơ.</li>
          <li>
            Người mắc bệnh mãn tính: tim mạch, huyết áp, dạ dày, hô hấp,...
          </li>
        </ul>
      ),
    },
    {
      id: 3,
      question: "Máu sẽ được làm các xét nghiệm nào?",
      answer: (
        <ul>
          <li>Nhóm máu (ABO, Rh), HIV, viêm gan B/C, giang mai, sốt rét.</li>
          <li>
            Kết quả được giữ bí mật và có tư vấn miễn phí nếu phát hiện bệnh.
          </li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "Thành phần và chức năng của máu:",
      answer: (
        <ul>
          <li>Hồng cầu: vận chuyển oxy.</li>
          <li>Bạch cầu: bảo vệ cơ thể.</li>
          <li>Tiểu cầu: đông cầm máu.</li>
          <li>
            Huyết tương: chứa kháng thể, yếu tố đông máu, chất dinh dưỡng.
          </li>
        </ul>
      ),
    },
    {
      id: 5,
      question: "Vì sao cần truyền máu?",
      answer: (
        <ul>
          <li>Mất máu do tai nạn, phẫu thuật, chảy máu nội tạng,...</li>
          <li>Bệnh lý: ung thư máu, suy tủy, máu khó đông,...</li>
          <li>Các kỹ thuật y học hiện đại cần truyền máu.</li>
        </ul>
      ),
    },
    {
      id: 6,
      question: "Nhu cầu máu tại Việt Nam",
      answer: (
        <ul>
          <li>Cần khoảng 1.800.000 đơn vị máu/năm.</li>
          <li>Hiện đáp ứng được khoảng 54% nhu cầu.</li>
        </ul>
      ),
    },
    {
      id: 7,
      question: "Hiến máu có ảnh hưởng sức khỏe không?",
      answer: (
        <ul>
          <li>Không ảnh hưởng nếu thực hiện đúng hướng dẫn.</li>
          <li>Máu được cơ thể tái tạo mỗi ngày.</li>
          <li>Nhiều người hiến máu nhiều lần vẫn khỏe mạnh.</li>
        </ul>
      ),
    },
    {
      id: 8,
      question: "Có thể bị nhiễm bệnh khi hiến máu không?",
      answer: (
        <ul>
          <li>Không. Dụng cụ lấy máu vô trùng, dùng một lần.</li>
        </ul>
      ),
    },
    {
      id: 9,
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer: (
        <ul>
          <li>Ngủ đủ, không thức khuya.</li>
          <li>Không uống rượu/bia trước khi hiến máu.</li>
          <li>Ăn nhẹ, mang giấy tờ tùy thân.</li>
        </ul>
      ),
    },
    {
      id: 10,
      question: "Những trường hợp cần trì hoãn hiến máu:",
      answer: (
        <ul>
          <li>12 tháng: sau phẫu thuật, mắc bệnh nặng, sinh con,...</li>
          <li>6 tháng: xăm trổ, bấm lỗ cơ thể, phơi nhiễm dịch máu,...</li>
          <li>
            4 tuần: mắc các bệnh truyền nhiễm thông thường, tiêm vắc xin thông
            dụng.
          </li>
          <li>7 ngày: cúm, cảm, dị ứng, đau đầu, tiêm một số vắc xin.</li>
          <li>
            Nghề nghiệp đặc thù (lái xe, leo núi, công nhân trên cao, thể thao
            chuyên nghiệp...) chỉ hiến máu vào ngày nghỉ hoặc sau 12 giờ.
          </li>
        </ul>
      ),
    },
  ];

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        key: "req1",
        bloodType: "O+",
        quantity: 2,
        note: "Bệnh viện Đa khoa Ánh Dương. Cần gấp cho ca phẫu thuật tim. Độ khẩn cấp: Rất khẩn cấp. (Đăng ngày: 10/07/2024)",
        id_internal: 1,
        location: "Bệnh viện Đa khoa Ánh Dương",
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
        id: 3,
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

  useEffect(() => {
    // Lấy tin tức từ API
    fetchAllNews().then((data) => {
      if (Array.isArray(data)) {
        setNewsData(
          data
            .sort(
              (a, b) =>
                new Date(b.postedAt || b.createdAt || b.date) -
                new Date(a.postedAt || a.createdAt || a.date)
            )
            .slice(0, 6)
            .map((item) => ({
              postId: item.postId,
              date: new Date(
                item.postedAt || item.createdAt || item.date
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              title: item.title,
              image: item.image || item.imgUrl || "placeholder.jpg",
              link: `/blog/${item.postId}`,
            }))
        );
      }
    });
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

  const isAuthenticated = authService.isUserAuthenticated();

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
        <Link
          to={isAuthenticated ? "/member/blood-donation-form" : "/login"}
          className="cta-button tertiary table-action-button"
        >
          Hỗ trợ
        </Link>
      ),
      width: "150px",
      align: "center",
    },
  ];

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = faqData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Group news into chunks of 3 for each slide
  const itemsPerSlide = 3;
  const newsSlides = [];
  for (let i = 0; i < newsData.length; i += itemsPerSlide) {
    newsSlides.push(newsData.slice(i, i + itemsPerSlide));
  }

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
    });
  }, []);

  return (
    <>
      {!hideNavbar && (CustomNavbar ? <CustomNavbar /> : <GuestNavbar />)}
      <div className="guest-home-page">
        {CustomHeroSection ? (
          <CustomHeroSection />
        ) : (
          <section
            className="hero-section"
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
                  HIẾN MÁU CỨU NGƯỜI
                  <br />
                  NHẬN MÁU CỨU MÌNH
                </h1>
                <p className="merriweather-content">
                  Dù bạn là người cho hay người cần, chúng tôi luôn sẵn sàng kết
                  nối sự sống bằng từng giọt máu yêu thương.
                </p>
                <div className="cta-row">
                  <Link to="/login" className="cta-button">
                    ĐĂNG KÝ HIẾN MÁU
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    ĐĂNG KÝ NHẬN MÁU
                  </Link>
                </div>
                {/* <div className="demo-link">
                  <Link to="/test-accounts" className="demo-button">
                    🧪 Xem tài khoản demo
                  </Link>';l
                </div> */}
              </div>
              <div className="hero-image">
                <img src={blood1} alt="Truyền máu" className="hero-img" />
              </div>
            </div>
          </section>
        )}

        <section className="hospital-info-section" data-aos="fade-right">
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
                <FaPhoneAlt className="icon phone" /> (028) 3957 1343
              </li>
              <li>
                <FaEnvelope className="icon email" /> anhduonghospital@gmail.com
              </li>
              <li>
                <FaMapMarkerAlt className="icon address" /> Đường Cách Mạng
                Tháng 8, Quận 3, TP.HCM, Vietnam
              </li>
              <li>
                <FaClock className="icon clock" /> Thứ 2 - Chủ nhật: 07:00 -
                12:00, Chiều: 13:00 - 16:30
              </li>
            </ul>
          </div>
        </section>

        <section className="emergency-section" data-aos="fade-up">
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

        <section className="achievement-section" data-aos="zoom-in">
          <div className="achievement-container">
            <div className="achievement-header">
              <div className="achievement-line"></div>
              <h3 className="achievement-subtitle">THÀNH TỰU NỔI BẬT</h3>
              <div className="achievement-line"></div>
            </div>
            <h2 className="achievement-title">THÀNH TỰU CỦA CHÚNG TÔI</h2>

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

        <section className="faq-section" data-aos="fade-left">
          <div className="faq-container">
            <div className="faq-header">
              <h2 className="faq-title">NHỮNG CÂU HỎI THƯỜNG GẶP</h2>
            </div>

            <div className="faq-content">
              <Collapse
                className="faq-collapse"
                expandIcon={({ isActive }) => (
                  <PlusOutlined
                    rotate={isActive ? 45 : 0}
                    className="faq-expand-icon"
                  />
                )}
                expandIconPosition="end"
                ghost
              >
                {currentQuestions.map((item, index) => (
                  <Panel
                    header={
                      <div className="faq-question">
                        <span className="question-number">
                          {startIndex + index + 1}:
                        </span>{" "}
                        {item.question}
                      </div>
                    }
                    key={item.id}
                    className="faq-panel"
                  >
                    <div className="faq-answer">{item.answer}</div>
                  </Panel>
                ))}
              </Collapse>

              <div className="faq-pagination">
                <Pagination
                  current={currentPage}
                  total={faqData.length}
                  pageSize={questionsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  showTotal={false}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="news-section" data-aos="fade-up">
          <div className="news-container">
            <div className="news-header">
              <div className="news-subtitle-wrapper">
                <div className="news-line"></div>
                <h3 className="news-subtitle">TIN TỨC HÔM NAY</h3>
                <div className="news-line"></div>
              </div>
              <h2 className="news-title">TIN TỨC CỦA BỆNH VIỆN</h2>
            </div>

            <Carousel
              autoplay
              autoplaySpeed={3000}
              draggable
              swipeToSlide
              dots={{ className: "news-carousel-dots" }}
            >
              {newsSlides.map((slide, index) => (
                <div key={index}>
                  <div className="news-grid">
                    {slide.map((news) => (
                      <Link key={news.id} to={news.link} className="news-card">
                        <div
                          className="news-image"
                          style={{ backgroundImage: `url(${news.image})` }}
                        ></div>
                        <div className="news-content">
                          <div className="news-date">{news.date}</div>
                          <div className="news-desc">{news.title}</div>
                          <div className="news-button">XEM THÊM</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

        <section className="map-section" data-aos="fade-up">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447732221159!2d106.68383951480076!3d10.775123762287596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMwLjQiTiAxMDbCsDQxJzExLjQiRQ!5e0!3m2!1sen!2s!4v1634567890123"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Bệnh viện Ánh Dương Location"
            ></iframe>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default GuestHomePage;
