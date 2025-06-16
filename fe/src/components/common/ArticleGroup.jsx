import React from "react";
import { Typography, Card, Tag, Pagination } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ArticleGroup = ({ title, articles = [], gradient }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 3; // Chỉ hiển thị 3 card mỗi trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentArticles = articles.slice(startIndex, endIndex);

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="article-group" style={{ "--header-gradient": gradient }}>
      <div className="group-header">
        <div className="group-header-content">
          <Title level={3} className="group-title">
            {title}
          </Title>
        </div>
      </div>

      <div className="article-grid">
        <div className="article-list">
          {currentArticles.map((article) => (
            <Card
              key={article.id}
              className="article-card"
              hoverable
              cover={
                <div className="article-image-container">
                  <img
                    alt={article.title}
                    src={
                      article.imageUrl ||
                      article.imgUrl ||
                      "https://via.placeholder.com/400x200?text=Blood+Donation"
                    }
                  />
                </div>
              }
            >
              <Link to={`/blood-info/${article.id}`}>
                <div className="article-content">
                  <Title level={4} className="article-title">
                    {article.title}
                  </Title>
                  <Paragraph className="article-description">
                    {article.description || article.shortContent}
                  </Paragraph>
                  {article.tags && (
                    <div className="article-tags">
                      {article.tags.map((tag) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {articles.length > pageSize && (
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={articles.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              className="article-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGroup;
