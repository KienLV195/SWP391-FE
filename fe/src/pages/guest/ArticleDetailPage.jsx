import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBloodArticleDetail } from "../../services/bloodArticleService";
import { Card, Spin, Typography, Button, Divider, Space } from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  TagOutlined,
} from "@ant-design/icons";
import useRequest from "../../hooks/useFetchData";
import "../../styles/pages/BloodInfoPage.scss";
import ArticleTags from "../../components/common/ArticleTags";

const { Title, Paragraph, Text } = Typography;

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article, loading } = useRequest(
    () => getBloodArticleDetail(id),
    [id]
  );

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
            onClick={() => navigate("/blood-info")}
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
          onClick={() => navigate("/blood-info")}
          className="back-button"
        >
          Quay lại danh sách
        </Button>

        <Card className="article-card">
          <div className="article-header">
            <Title level={2} className="article-title">
              {article.title}
            </Title>

            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="article-tags">
                <TagOutlined className="tag-icon" />
                <ArticleTags tags={article.tags} />
              </div>
            )}
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
                  {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Space>
            </Space>
          </div>

          {article.imgUrl && (
            <div className="article-image-wrapper">
              <img
                src={article.imgUrl}
                alt={article.title}
                className="article-image"
              />
            </div>
          )}

          <div className="article-content">
            {formatContent(article.content)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
