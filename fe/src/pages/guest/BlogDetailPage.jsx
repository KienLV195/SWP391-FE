import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchNewsById } from "../../services/newsService";
import { Card, Spin, Typography, Button, Divider, Space } from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import "../../styles/pages/BloodInfoPage.scss";

const { Title, Paragraph, Text } = Typography;

const BlogDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setArticle(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchNewsById(postId)
      .then((data) => setArticle(data))
      .catch((error) => {
        console.error("Error fetching blog detail:", error);
        setArticle(null);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="loading-container">
          <Spin size="large" tip="Đang tải bài viết..." />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="error-container">
          <Title level={3}>
            <BookOutlined className="title-icon" /> Không tìm thấy bài viết
          </Title>
          <Paragraph>Bài viết không tồn tại hoặc đã bị xóa.</Paragraph>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/blog")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Format content with proper line breaks
  const formatContent = (content) => {
    if (!content) return "";
    return content.split("\n").map((paragraph, index) => (
      <Paragraph key={index} className="content-paragraph">
        {paragraph}
      </Paragraph>
    ));
  };

  return (
    <div className="article-detail-page">
      <div className="article-container">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/blog")}
          className="back-button"
        >
          Quay lại danh sách
        </Button>

        <Card className="article-card">
          <div className="article-header">
            <Title level={2} className="article-title">
              {article.title}
            </Title>
          </div>

          <div className="article-meta">
            <Space split={<Divider type="vertical" />}>
              <Space>
                <UserOutlined />
                <Text>{article.userName || "Hệ thống"}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text>
                  {new Date(
                    article.createdAt || article.date
                  ).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Space>
            </Space>
          </div>

          {article.image || article.imgUrl ? (
            <div className="article-image-wrapper">
              <img
                src={article.image || article.imgUrl}
                alt={article.title}
                className="article-image"
              />
            </div>
          ) : null}

          <div className="article-content">
            {formatContent(article.content)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;
