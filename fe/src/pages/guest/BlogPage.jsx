import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import { Input, Row, Col, Card, Button, Carousel, Pagination } from "antd";
import { FaSearch, FaEye, FaCalendarAlt } from "react-icons/fa";
import Highlighter from "react-highlight-words";
import "../../styles/pages/BlogPage.scss";

const { Meta } = Card;

// Dữ liệu giả lập
const blogPosts = [
  // Carousel posts
  {
    id: 1,
    title: "Ngày hội hiến máu nhân đạo 2025",
    summary: "Hãy tham gia ngày hội hiến máu lớn nhất năm tại bệnh viện.",
    content:
      "Ngày hội hiến máu nhân đạo 2025 sẽ diễn ra vào ngày 15/06/2025 với sự tham gia của hàng trăm tình nguyện viên. Sự kiện nhằm mục đích cung cấp máu cho các ca phẫu thuật khẩn cấp.",
    image: "https://via.placeholder.com/1200x400?text=Ngày+hội+hiến+máu",
    views: 2500,
    date: "2025-06-01",
  },
  {
    id: 2,
    title: "Cập nhật tình hình máu dự trữ",
    summary: "Bệnh viện thông báo về tình trạng máu dự trữ hiện tại.",
    content:
      "Hiện tại, lượng máu nhóm O- đang ở mức thấp, bệnh viện kêu gọi cộng đồng hiến máu để đảm bảo nguồn cung cho các ca cấp cứu.",
    image: "https://via.placeholder.com/1200x400?text=Cập+nhật+máu+dự+trữ",
    views: 1800,
    date: "2025-05-30",
  },
  // Other posts
  {
    id: 3,
    title: "Lợi ích sức khỏe từ hiến máu định kỳ",
    summary: "Tìm hiểu cách hiến máu định kỳ cải thiện sức khỏe.",
    content:
      "Hiến máu định kỳ giúp kích thích sản xuất máu mới, giảm nguy cơ bệnh tim mạch và kiểm tra sức khỏe miễn phí.",
    image: "https://via.placeholder.com/300x200?text=Lợi+ích+hiến+máu",
    views: 1200,
    date: "2025-05-28",
  },
  {
    id: 4,
    title: "Chiến dịch hiến máu mùa hè",
    summary: "Tham gia chiến dịch hiến máu mùa hè để cứu sống người bệnh.",
    content:
      "Chiến dịch hiến máu mùa hè 2025 sẽ tổ chức tại nhiều địa điểm, nhằm tăng cường nguồn máu trong mùa cao điểm.",
    image: "https://via.placeholder.com/300x200?text=Chiến+dịch+hiến+máu",
    views: 950,
    date: "2025-05-25",
  },
  {
    id: 5,
    title: "Tin tức: Thiếu hụt máu nhóm AB+",
    summary: "Bệnh viện kêu gọi hiến máu nhóm AB+ gấp.",
    content:
      "Do nhu cầu tăng cao, lượng máu nhóm AB+ đang thiếu hụt nghiêm trọng. Hãy đến hiến máu ngay hôm nay.",
    image: "https://via.placeholder.com/300x200?text=Thiếu+máu+AB+",
    views: 800,
    date: "2025-05-20",
  },
  {
    id: 6,
    title: "Hướng dẫn an toàn khi hiến máu",
    summary: "Những lưu ý quan trọng để hiến máu an toàn.",
    content:
      "Trước khi hiến máu, hãy ăn uống đầy đủ và nghỉ ngơi, tránh rượu bia và thuốc lá để đảm bảo an toàn.",
    image: "https://via.placeholder.com/300x200?text=Hướng+dẫn+an+toàn",
    views: 700,
    date: "2025-05-15",
  },
];

const BlogPage = ({ CustomNavbar, hideNavbar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = 6; // Số bài viết mỗi trang (3 hàng x 2 bài/hàng)

  // Lọc và sắp xếp theo thời gian (mới nhất lên đầu)
  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter((post) => {
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchTerm]);

  // Lấy bài viết cho trang hiện tại
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleKnowMore = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <>
      {!hideNavbar && (CustomNavbar ? <CustomNavbar /> : <GuestNavbar />)}
      <div className="guest-home-page">
        <section className="content-section">
          <div className="page-header">
            <h1 className="page-title merriweather-title">TIN TỨC HIẾN MÁU</h1>
            <p className="page-description merriweather-content">
              Đây là trang tin tức nội dung tin tức, bài viết, hoặc các thông
              tin liên quan đến hiến máu tại đây.
            </p>
          </div>

          {/* Carousel Section */}
          <div className="carousel-section">
            <Carousel autoplay>
              {blogPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="carousel-item">
                  <Card
                    hoverable
                    cover={<img alt={post.title} src={post.image} />}
                    className="carousel-card"
                    onClick={() => handleKnowMore(post.id)}
                  >
                    <Meta
                      title={
                        <Highlighter
                          highlightClassName="highlight-text"
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={post.title}
                        />
                      }
                      description={
                        <Highlighter
                          highlightClassName="highlight-text"
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={post.summary}
                        />
                      }
                    />
                    <div className="carousel-meta">
                      <div className="views-badge">
                        <FaEye /> {post.views.toLocaleString()}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Search */}
          <div className="controls-section">
            <div className="search-controls">
              <Input
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<FaSearch className="search-icon" />}
                size="large"
                className="search-input"
              />
            </div>
          </div>

          {/* Blog Posts List */}
          {paginatedPosts.length > 0 ? (
            <>
              <div className="category-section">
                <Row gutter={[24, 24]} className="document-grid">
                  {paginatedPosts.map((post) => (
                    <Col xs={24} sm={12} lg={12} key={post.id}>
                      <Card
                        hoverable
                        cover={
                          <div className="card-cover">
                            <img alt={post.title} src={post.image} />
                            <div className="card-overlay">
                              <div className="views-badge">
                                <FaEye /> {post.views.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        }
                        className="document-card"
                        onClick={() => handleKnowMore(post.id)}
                      >
                        <div className="card-content">
                          <div className="card-meta">
                            <div className="date-tag">
                              <FaCalendarAlt />{" "}
                              {new Date(post.date).toLocaleDateString("vi-VN")}
                            </div>
                          </div>

                          <h3 className="document-title">
                            <Highlighter
                              highlightClassName="highlight-text"
                              searchWords={[searchTerm]}
                              autoEscape={true}
                              textToHighlight={post.title}
                            />
                          </h3>

                          <p className="document-summary">
                            <Highlighter
                              highlightClassName="highlight-text"
                              searchWords={[searchTerm]}
                              autoEscape={true}
                              textToHighlight={post.summary}
                            />
                          </p>

                          <Button
                            type="primary"
                            className="read-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleKnowMore(post.id);
                            }}
                          >
                            Đọc ngay
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredPosts.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  simple
                />
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📝</div>
              <h3>Không tìm thấy tin tức nào</h3>
              <p>Hãy thử thay đổi từ khóa tìm kiếm</p>
            </div>
          )}
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BlogPage;
