import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import { Input, Row, Col, Card, Button, Select, Space, Pagination } from "antd";
import { FaSearch, FaTag, FaEye, FaFilter } from "react-icons/fa";
import Highlighter from "react-highlight-words";
import "../../styles/pages/BloodInfoPage.scss";

const { Option } = Select;

// Dữ liệu giả lập
const documents = [
  // Nhóm máu
  {
    id: 1,
    title: "Nhóm máu và tính chất",
    summary: "Tìm hiểu về các nhóm máu A, B, AB, O và yếu tố Rh.",
    content:
      "Nhóm máu là một hệ thống phân loại máu dựa trên sự hiện diện hoặc vắng mặt của các kháng nguyên trên bề mặt hồng cầu. Có 4 nhóm máu chính: A, B, AB và O, cùng với yếu tố Rh (dương hoặc âm). Hệ thống nhóm máu ABO và Rh rất quan trọng trong việc truyền máu an toàn, vì sự không tương thích có thể gây phản ứng nghiêm trọng.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Nhóm+máu",
    views: 1200,
  },
  {
    id: 5,
    title: "Nhóm máu hiếm",
    summary: "Tìm hiểu về các nhóm máu hiếm và ý nghĩa của chúng.",
    content:
      "Nhóm máu hiếm là những nhóm máu ít gặp trong dân số, chẳng hạn như nhóm máu Rh-null hay Bombay. Những nhóm máu này có thể gây khó khăn trong việc truyền máu, đặc biệt khi cần máu khẩn cấp. Việc hiểu biết và bảo vệ những người có nhóm máu hiếm là rất quan trọng.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Nhóm+máu+hiếm",
    views: 900,
  },
  {
    id: 6,
    title: "Nhóm máu và sức khỏe",
    summary: "Mối liên hệ giữa nhóm máu và nguy cơ bệnh tật.",
    content:
      "Nhóm máu có thể ảnh hưởng đến nguy cơ mắc một số bệnh như tim mạch, ung thư hoặc bệnh tiêu hóa. Ví dụ, người nhóm máu A có nguy cơ cao hơn về bệnh tim, trong khi nhóm máu O ít bị ảnh hưởng bởi một số bệnh nhiễm trùng. Hiểu về nhóm máu giúp bạn phòng ngừa bệnh tốt hơn.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Nhóm+máu+và+sức+khỏe",
    views: 1100,
  },
  {
    id: 7,
    title: "Nhóm máu và chế độ ăn",
    summary: "Chế độ ăn phù hợp với từng nhóm máu.",
    content:
      "Một số nghiên cứu cho rằng chế độ ăn uống nên được điều chỉnh theo nhóm máu. Ví dụ, người nhóm máu O có thể hợp với chế độ ăn giàu protein, trong khi người nhóm máu A nên ăn nhiều rau củ. Tuy nhiên, các nghiên cứu này vẫn đang gây tranh cãi trong cộng đồng khoa học.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Nhóm+máu+và+chế+độ+ăn",
    views: 850,
  },
  {
    id: 8,
    title: "Tương thích nhóm máu",
    summary: "Hiểu về sự tương thích giữa các nhóm máu.",
    content:
      "Sự tương thích nhóm máu rất quan trọng trong truyền máu và cấy ghép nội tạng. Nhóm máu O- được coi là nhóm máu 'cho chung' vì có thể truyền cho mọi nhóm máu khác, trong khi AB+ là nhóm máu 'nhận chung' vì có thể nhận máu từ bất kỳ nhóm nào.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Tương+thích+nhóm+máu",
    views: 1300,
  },
  {
    id: 9,
    title: "Yếu tố Rh trong nhóm máu",
    summary: "Vai trò của yếu tố Rh trong truyền máu.",
    content:
      "Yếu tố Rh là một kháng nguyên quan trọng trong nhóm máu, chia thành Rh+ và Rh-. Sự không tương thích Rh giữa mẹ và thai nhi có thể gây biến chứng thai kỳ như bệnh tan máu ở trẻ sơ sinh. Việc kiểm tra Rh rất cần thiết trước khi truyền máu hoặc mang thai.",
    category: "Nhóm máu",
    image: "https://via.placeholder.com/300x200?text=Yếu+tố+Rh",
    views: 950,
  },
  // Truyền máu
  {
    id: 2,
    title: "Truyền máu toàn phần",
    summary: "Quy trình và lưu ý khi truyền máu toàn phần.",
    content:
      "Truyền máu toàn phần là quá trình truyền toàn bộ máu từ người hiến cho người nhận, bao gồm hồng cầu, huyết tương, tiểu cầu và các yếu tố đông máu. Quy trình này thường được sử dụng trong trường hợp mất máu cấp tính, chẳng hạn như sau phẫu thuật hoặc chấn thương. Tuy nhiên, cần đảm bảo sự tương thích nhóm máu và kiểm tra kỹ lưỡng để tránh phản ứng truyền máu.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=Truyền+máu",
    views: 800,
  },
  {
    id: 10,
    title: "Truyền máu thành phần",
    summary: "Ưu điểm của việc truyền máu thành phần.",
    content:
      "Truyền máu thành phần chỉ truyền một phần máu cụ thể như hồng cầu, huyết tương hoặc tiểu cầu, tùy theo nhu cầu của bệnh nhân. Phương pháp này hiệu quả hơn truyền máu toàn phần vì giảm nguy cơ phản ứng phụ và tối ưu hóa nguồn máu hiến.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=Truyền+máu+thành+phần",
    views: 700,
  },
  {
    id: 11,
    title: "Phản ứng truyền máu",
    summary: "Nguyên nhân và cách xử lý phản ứng truyền máu.",
    content:
      "Phản ứng truyền máu có thể xảy ra do không tương thích nhóm máu hoặc phản ứng miễn dịch. Các triệu chứng bao gồm sốt, ớn lạnh, hoặc khó thở. Việc kiểm tra kỹ lưỡng trước khi truyền và theo dõi sát sao trong quá trình truyền là rất quan trọng.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=Phản+ứng+truyền+máu",
    views: 650,
  },
  {
    id: 12,
    title: "An toàn truyền máu",
    summary: "Các biện pháp đảm bảo an toàn khi truyền máu.",
    content:
      "Để đảm bảo an toàn khi truyền máu, cần kiểm tra nhóm máu, sàng lọc bệnh truyền nhiễm như HIV, viêm gan B, và thực hiện quy trình truyền máu theo tiêu chuẩn y tế. Các cơ sở y tế cũng cần có hệ thống quản lý máu hiệu quả.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=An+toàn+truyền+máu",
    views: 820,
  },
  {
    id: 13,
    title: "Truyền máu khẩn cấp",
    summary: "Quy trình truyền máu trong tình huống khẩn cấp.",
    content:
      "Trong các trường hợp khẩn cấp như tai nạn hoặc xuất huyết nặng, truyền máu khẩn cấp cần được thực hiện nhanh chóng. Nhóm máu O- thường được sử dụng trong những trường hợp này vì tính tương thích cao, nhưng vẫn cần kiểm tra sau khi ổn định bệnh nhân.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=Truyền+máu+khẩn+cấp",
    views: 780,
  },
  {
    id: 14,
    title: "Bảo quản máu truyền",
    summary: "Cách bảo quản máu để sử dụng an toàn.",
    content:
      "Máu hiến cần được bảo quản ở nhiệt độ 2-6°C trong các túi máu chuyên dụng, với thời hạn sử dụng khoảng 35-42 ngày. Huyết tương có thể được đông lạnh để bảo quản lâu hơn, trong khi tiểu cầu cần được giữ ở nhiệt độ phòng và sử dụng trong 5 ngày.",
    category: "Truyền máu",
    image: "https://via.placeholder.com/300x200?text=Bảo+quản+máu",
    views: 690,
  },
  // Thành phần máu
  {
    id: 3,
    title: "Thành phần máu",
    summary: "Hồng cầu, huyết tương, tiểu cầu và vai trò của chúng.",
    content:
      "Máu bao gồm nhiều thành phần quan trọng: hồng cầu (vận chuyển oxy), huyết tương (chứa nước, protein và các chất dinh dưỡng), tiểu cầu (giúp đông máu), và bạch cầu (chống nhiễm trùng). Mỗi thành phần có vai trò riêng trong cơ thể, và việc truyền máu thành phần (chỉ hồng cầu hoặc huyết tương) thường được ưu tiên hơn truyền máu toàn phần trong y học hiện đại.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Thành+phần+máu",
    views: 1500,
  },
  {
    id: 15,
    title: "Hồng cầu và chức năng",
    summary: "Vai trò của hồng cầu trong cơ thể.",
    content:
      "Hồng cầu là thành phần chính của máu, chịu trách nhiệm vận chuyển oxy từ phổi đến các mô và đưa CO2 quay trở lại phổi. Hồng cầu chứa hemoglobin, một protein giúp liên kết với oxy. Thiếu hồng cầu có thể dẫn đến thiếu máu.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Hồng+cầu",
    views: 1400,
  },
  {
    id: 16,
    title: "Huyết tương và vai trò",
    summary: "Huyết tương đóng vai trò gì trong máu?",
    content:
      "Huyết tương chiếm khoảng 55% thể tích máu, chứa nước, protein, chất điện giải và các chất dinh dưỡng. Nó giúp vận chuyển các chất trong cơ thể, duy trì áp suất máu, và đóng vai trò trong đông máu và miễn dịch.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Huyết+tương",
    views: 1350,
  },
  {
    id: 17,
    title: "Tiểu cầu và đông máu",
    summary: "Tiểu cầu giúp đông máu như thế nào?",
    content:
      "Tiểu cầu là các tế bào nhỏ trong máu, có vai trò quan trọng trong quá trình đông máu. Khi mạch máu bị tổn thương, tiểu cầu tập hợp lại và tạo thành cục máu đông để ngăn chảy máu. Thiếu tiểu cầu có thể dẫn đến xuất huyết.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Tiểu+cầu",
    views: 1250,
  },
  {
    id: 18,
    title: "Bạch cầu và miễn dịch",
    summary: "Bạch cầu bảo vệ cơ thể ra sao?",
    content:
      "Bạch cầu là một phần quan trọng của hệ miễn dịch, giúp cơ thể chống lại nhiễm trùng. Có nhiều loại bạch cầu, mỗi loại có vai trò riêng như tiêu diệt vi khuẩn, virus, hoặc sản xuất kháng thể để bảo vệ cơ thể.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Bạch+cầu",
    views: 1150,
  },
  {
    id: 19,
    title: "Protein trong máu",
    summary: "Các protein trong máu có chức năng gì?",
    content:
      "Protein trong máu, như albumin và globulin, đóng vai trò quan trọng trong vận chuyển chất, duy trì áp suất thẩm thấu, và hỗ trợ hệ miễn dịch. Các protein đông máu như fibrinogen cũng giúp ngăn ngừa chảy máu khi cần thiết.",
    category: "Thành phần máu",
    image: "https://via.placeholder.com/300x200?text=Protein+trong+máu",
    views: 1050,
  },
  // Hướng dẫn
  {
    id: 4,
    title: "Hướng dẫn hiến máu",
    summary: "Các bước chuẩn bị trước và sau khi hiến máu.",
    content:
      "Hiến máu là một hành động nhân đạo giúp cứu sống nhiều người. Trước khi hiến máu, bạn cần ăn uống đầy đủ, ngủ đủ giấc và không sử dụng rượu bia. Sau khi hiến máu, hãy nghỉ ngơi, uống nhiều nước và tránh hoạt động nặng. Quy trình hiến máu thường kéo dài khoảng 30 phút và rất an toàn nếu thực hiện tại các cơ sở y tế uy tín.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Hướng+dẫn",
    views: 2000,
  },
  {
    id: 20,
    title: "Điều kiện hiến máu",
    summary: "Ai có thể hiến máu và ai không?",
    content:
      "Để hiến máu, bạn cần từ 18-60 tuổi, cân nặng trên 45kg, và không mắc các bệnh như HIV, viêm gan, hoặc bệnh tim mạch. Phụ nữ mang thai, đang kỳ kinh nguyệt, hoặc vừa sinh con trong vòng 6 tháng không được hiến máu.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Điều+kiện+hiến+máu",
    views: 1900,
  },
  {
    id: 21,
    title: "Chăm sóc sau hiến máu",
    summary: "Làm gì sau khi hiến máu để phục hồi?",
    content:
      "Sau khi hiến máu, bạn nên nghỉ ngơi ít nhất 10 phút, uống nhiều nước, ăn nhẹ, và tránh vận động mạnh trong 24 giờ. Nếu cảm thấy chóng mặt hoặc mệt mỏi, hãy nằm xuống và nâng chân lên để cải thiện lưu thông máu.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Chăm+sóc+sau+hiến+máu",
    views: 1800,
  },
  {
    id: 22,
    title: "Lợi ích của hiến máu",
    summary: "Hiến máu mang lại lợi ích gì cho sức khỏe?",
    content:
      "Hiến máu không chỉ cứu người mà còn mang lại lợi ích cho người hiến, như giảm nguy cơ bệnh tim, kích thích cơ thể sản xuất máu mới, và kiểm tra sức khỏe miễn phí trước khi hiến. Đây là một hành động vừa ý nghĩa vừa tốt cho sức khỏe.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Lợi+ích+hiến+máu",
    views: 1700,
  },
  {
    id: 23,
    title: "Hiến máu định kỳ",
    summary: "Tần suất hiến máu an toàn là bao nhiêu?",
    content:
      "Người khỏe mạnh có thể hiến máu định kỳ mỗi 3-4 tháng một lần, tùy thuộc vào giới tính và thể trạng. Nam giới có thể hiến máu 4 lần/năm, trong khi nữ giới nên hiến 3 lần/năm để đảm bảo sức khỏe.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Hiến+máu+định+kỳ",
    views: 1600,
  },
  {
    id: 24,
    title: "Những lưu ý khi hiến máu",
    summary: "Cần lưu ý gì trước khi hiến máu?",
    content:
      "Trước khi hiến máu, bạn nên tránh thức khuya, không uống rượu bia ít nhất 48 giờ, và không hút thuốc lá trước khi hiến. Hãy mặc áo rộng rãi, thoải mái và cung cấp thông tin y tế chính xác cho bác sĩ kiểm tra.",
    category: "Hướng dẫn",
    image: "https://via.placeholder.com/300x200?text=Lưu+ý+hiến+máu",
    views: 1550,
  },
];

const BloodInfoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState({}); // State quản lý trang hiện tại cho mỗi danh mục
  const navigate = useNavigate();
  const pageSize = 3; // Số tài liệu mỗi trang

  // Lấy danh sách categories
  const categories = useMemo(() => {
    const categorySet = new Set(documents.map((doc) => doc.category));
    return Array.from(categorySet).sort();
  }, []);

  // Lọc tài liệu
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Nhóm tài liệu theo category
  const groupedDocuments = useMemo(() => {
    const grouped = filteredDocuments.reduce((acc, doc) => {
      const category = doc.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {});

    // Sắp xếp tài liệu trong mỗi category theo tiêu đề
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.title.localeCompare(b.title));
    });

    return grouped;
  }, [filteredDocuments]);

  // Khởi tạo trang hiện tại cho mỗi danh mục
  useMemo(() => {
    const initialPages = {};
    categories.forEach((category) => {
      initialPages[category] = 1;
    });
    setCurrentPage(initialPages);
  }, [categories]);

  const handleKnowMore = (id) => {
    navigate(`/document/${id}`);
  };

  const handlePageChange = (category, page) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]: page,
    }));
  };

  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        <section className="content-section">
          <div className="page-header">
            <h1 className="page-title">TÀI LIỆU HIẾN MÁU</h1>
            <p className="page-description">
              Khám phá kho tài liệu phong phú về hiến máu, từ kiến thức cơ bản
              đến hướng dẫn chuyên sâu
            </p>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <div className="search-controls">
              <Input
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<FaSearch className="search-icon" />}
                size="large"
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <Space size="middle">
                <div className="filter-item">
                  <FaFilter className="filter-icon" />
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Chọn danh mục"
                    size="large"
                    className="category-select"
                  >
                    <Option value="all">Tất cả danh mục</Option>
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Space>
            </div>
          </div>

          {/* Documents List */}
          {Object.keys(groupedDocuments).length > 0 ? (
            categories.map(
              (category) =>
                groupedDocuments[category] && (
                  <div key={category} className="category-section">
                    <div className="category-header">
                      <h2 className="category-title">{category}</h2>
                      <span className="category-count">
                        {groupedDocuments[category].length} tài liệu
                      </span>
                    </div>

                    <Row gutter={[24, 24]} className="document-grid">
                      {groupedDocuments[category]
                        .slice(
                          (currentPage[category] - 1) * pageSize,
                          currentPage[category] * pageSize
                        )
                        .map((doc) => (
                          <Col key={doc.id} xs={24} sm={12} lg={8}>
                            <Card
                              hoverable
                              cover={
                                <div className="card-cover">
                                  <img alt={doc.title} src={doc.image} />
                                  <div className="card-overlay">
                                    <div className="views-badge">
                                      <FaEye /> {doc.views.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              }
                              className="document-card"
                              onClick={() => handleKnowMore(doc.id)}
                            >
                              <div className="card-content">
                                <div className="card-meta">
                                  <div className="category-tag">
                                    <FaTag />
                                    <Highlighter
                                      highlightClassName="highlight-text"
                                      searchWords={[searchTerm]}
                                      autoEscape={true}
                                      textToHighlight={doc.category}
                                    />
                                  </div>
                                </div>

                                <h3 className="document-title">
                                  <Highlighter
                                    highlightClassName="highlight-text"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={doc.title}
                                  />
                                </h3>

                                <p className="document-summary">
                                  <Highlighter
                                    highlightClassName="highlight-text"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={doc.summary}
                                  />
                                </p>

                                <Button
                                  type="primary"
                                  className="read-more-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleKnowMore(doc.id);
                                  }}
                                >
                                  Đọc ngay
                                </Button>
                              </div>
                            </Card>
                          </Col>
                        ))}
                    </Row>

                    <div className="pagination-wrapper">
                      <Pagination
                        current={currentPage[category]}
                        pageSize={pageSize}
                        total={groupedDocuments[category].length}
                        onChange={(page) => handlePageChange(category, page)}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        simple
                      />
                    </div>
                  </div>
                )
            )
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>Không tìm thấy tài liệu nào</h3>
              <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BloodInfoPage;
