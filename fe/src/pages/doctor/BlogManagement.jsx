import React, { useState, useEffect } from "react";
import { Form } from "antd";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import "../../styles/pages/BlogManagementNew.scss";
import "../../styles/pages/admin/BlogManagement.module.scss";
import {
  Table,
  Card,
  Button,
  Select,
  Input,
  Space,
  Modal,
  message,
  Tabs,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BlogEditModal from "../../components/admin/blogs/BlogEditModal";
import BlogDetailModal from "../../components/admin/blogs/BlogDetailModal";
import BlogTableColumns from "../../components/admin/blogs/BlogTableColumns";
import authService from "../../services/authService";
import * as bloodArticleService from "../../services/bloodArticleService";
import * as newsService from "../../services/newsService";
import * as userApi from "../../services/userApi";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllTags, getNewsTags } from "../../services/tagService";
import { getNewsId, getNewsUserId, findNewsById } from "../../utils/newsUtils";

const { Option } = Select;

const BlogManagement = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [form] = Form.useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") === "news" ? "Tin tức" : "Tài liệu";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Lấy currentUser từ authService, nếu null thì lấy từ localStorage
  let currentUser = authService.getCurrentUser();
  if (!currentUser) {
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error(
        "Error loading currentUser from localStorage in Doctor:",
        error
      );
    }
  }

  const [articleLoading, setArticleLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getUsers()
      .then((usersData) => {
        const tempUserMap = {};
        if (Array.isArray(usersData)) {
          usersData.forEach((user) => {
            const userId = user.id || user.userId || user.userID;
            const userName =
              user.name ||
              user.fullName ||
              user.username ||
              user.email ||
              `User ${userId}`;
            tempUserMap[userId] = userName;
          });
        }
        setUserMap(tempUserMap);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUserMap({});
      });
  }, []);

  useEffect(() => {
    if (activeTab === "Tài liệu") {
      setArticleLoading(true);
      bloodArticleService
        .getBloodArticles()
        .then((articlesData) => {
          setArticles(Array.isArray(articlesData) ? articlesData : []);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          message.error("Không thể tải danh sách tài liệu");
        })
        .finally(() => setArticleLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Tin tức") {
      setNewsLoading(true);
      newsService
        .fetchAllNews()
        .then((data) => {
          setNews(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Error fetching news:", error);
          message.error("Không thể tải danh sách tin tức");
        })
        .finally(() => setNewsLoading(false));
    }
  }, [activeTab]);

  // Load tags based on active tab
  useEffect(() => {
    const loadTags = async () => {
      setTagsLoading(true);
      try {
        let tagsData = [];
        if (activeTab === "Tài liệu") {
          tagsData = await getAllTags();
        } else if (activeTab === "Tin tức") {
          tagsData = await getNewsTags();
        }
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (error) {
        console.error("Error loading tags:", error);
        setTags([]);
      } finally {
        setTagsLoading(false);
      }
    };

    loadTags();
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabCategories = [
    { key: "Tài liệu", label: "Tài liệu" },
    { key: "Tin tức", label: "Tin tức" },
  ];

  const getFilteredNews = () =>
    news.filter(
      (item) =>
        searchTerm === "" ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags &&
          Array.isArray(item.tags) &&
          item.tags
            .map((tag) => {
              const tagText =
                typeof tag === "object" && tag.tagName ? tag.tagName : tag;
              return tagText;
            })
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

  const getFilteredArticles = () =>
    articles.filter(
      (article) =>
        searchTerm === "" ||
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags &&
          Array.isArray(article.tags) &&
          article.tags
            .map((tag) => {
              const tagText =
                typeof tag === "object" && tag.tagName ? tag.tagName : tag;
              return tagText;
            })
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          (statusFilter === "all" || article.status === statusFilter))
    );

  const handleEditArticle = (article) => {
    const articleUserId =
      article.userId || article.userID || article.authorId || article.createdBy;
    const currentUserId =
      currentUser?.id || currentUser?.userId || currentUser?.userID;

    const canEdit =
      currentUser &&
      (currentUser.role === "4" || // Admin role
        currentUser.role === "admin" || // Fallback for string role
        currentUser.role === "Admin" || // Fallback for string role
        String(articleUserId) === String(currentUserId));

    if (!canEdit) {
      message.error("Bạn không có quyền chỉnh sửa bài viết này!");
      return;
    }

    setSelectedBlog(article);
    setEditImage(article.imgUrl || null);
    setEditModalVisible(true);
  };

  const handleViewArticle = (article) => {
    setSelectedBlog(article);
    setDetailModalVisible(true);
  };

  const handleDeleteArticle = async (articleId) => {
    const article = articles.find((a) => a.articleId === articleId);

    if (!article) {
      message.error("Không tìm thấy bài viết!");
      return;
    }

    const articleUserId =
      article.userId || article.userID || article.authorId || article.createdBy;
    const currentUserId =
      currentUser?.id || currentUser?.userId || currentUser?.userID;

    // Kiểm tra quyền: admin hoặc chính user đó
    const canDelete =
      currentUser &&
      (currentUser.role === "4" || // Admin role
        currentUser.role === "admin" || // Fallback for string role
        currentUser.role === "Admin" || // Fallback for string role
        String(articleUserId) === String(currentUserId));

    if (!canDelete) {
      message.error("Bạn không có quyền xóa bài viết này!");
      return;
    }

    try {
      await bloodArticleService.deleteArticle(articleId);

      // Update local state
      setArticles((prev) => prev.filter((a) => a.articleId !== articleId));

      // Refresh articles from server to ensure UI is in sync
      try {
        const refreshedArticles = await bloodArticleService.getBloodArticles();
        setArticles(Array.isArray(refreshedArticles) ? refreshedArticles : []);
      } catch (refreshError) {
        console.error("Error refreshing articles:", refreshError);
      }

      message.success("Xóa bài viết tài liệu thành công!");
    } catch (error) {
      console.error("Error deleting article:", error);
      message.error("Có lỗi xảy ra khi xóa bài viết tài liệu!");
    }
  };

  const handleEditNews = (newsItem) => {
    const newsUserId = getNewsUserId(newsItem);
    const currentUserId =
      currentUser?.id || currentUser?.userId || currentUser?.userID;

    const canEdit =
      currentUser &&
      (currentUser.role === "4" || // Admin role
        currentUser.role === "admin" || // Fallback for string role
        String(newsUserId) === String(currentUserId));

    if (!canEdit) {
      message.error("Bạn không có quyền chỉnh sửa bài viết này!");
      return;
    }

    setSelectedBlog(newsItem);
    setEditImage(newsItem.imgUrl || null);
    setEditModalVisible(true);
  };

  const handleViewNews = (newsItem) => {
    setSelectedBlog(newsItem);
    setDetailModalVisible(true);
  };

  const handleDeleteNews = async (newsId) => {
    const newsItem = findNewsById(news, newsId);

    if (!newsItem) {
      message.error("Không tìm thấy bài viết!");
      return;
    }

    const newsUserId = getNewsUserId(newsItem);
    const currentUserId =
      currentUser?.id || currentUser?.userId || currentUser?.userID;

    // Kiểm tra quyền: admin hoặc chính user đó
    const canDelete =
      currentUser &&
      (currentUser.role === "4" || // Admin role
        currentUser.role === "admin" || // Fallback for string role
        currentUser.role === "Admin" || // Fallback for string role
        String(newsUserId) === String(currentUserId));

    if (!canDelete) {
      message.error("Bạn không có quyền xóa bài viết này!");
      return;
    }

    try {
      const actualNewsId = getNewsId(newsItem);
      await newsService.deleteNews(actualNewsId);

      // Update local state
      setNews((prev) =>
        prev.filter((n) => {
          const nId = getNewsId(n);
          return nId !== actualNewsId;
        })
      );

      // Refresh news from server to ensure UI is in sync
      try {
        const refreshedNews = await newsService.fetchAllNews();
        setNews(Array.isArray(refreshedNews) ? refreshedNews : []);
      } catch (refreshError) {
        console.error("Error refreshing news:", refreshError);
      }

      message.success("Xóa bài viết tin tức thành công!");
    } catch (error) {
      console.error("Error deleting news:", error);
      message.error("Có lỗi xảy ra khi xóa bài viết tin tức!");
    }
  };

  if (loading) {
    return (
      <DoctorLayout pageTitle="Quản lý Blog">
        <div className="doctor-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout
      pageTitle="Quản lý Blog"
      pageDescription="Tạo, chỉnh sửa và quản lý các bài viết tài liệu, tin tức, thông báo của khoa Huyết học."
    >
      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabCategories.map((tab) => ({
            key: tab.key,
            label: tab.label,
            children: (
              <>
                <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
                  <Input.Search
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 260 }}
                    allowClear
                  />
                  {tab.key === "Tài liệu" && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/doctor/blog/create-article")}
                    >
                      Thêm bài viết mới
                    </Button>
                  )}
                  {tab.key === "Tin tức" && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/doctor/blog/create-news")}
                    >
                      Thêm bài viết mới
                    </Button>
                  )}
                  {tab.key === "Tin tức" && (
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 150 }}
                    >
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="published">Đã đăng</Option>
                      <Option value="draft">Bản nháp</Option>
                    </Select>
                  )}
                </Space>
                {tab.key === "Tài liệu" ? (
                  <Table
                    className="admin-blog-table"
                    columns={BlogTableColumns({
                      activeTab: "Tài liệu",
                      userMap,
                      onView: handleViewArticle,
                      onEdit: handleEditArticle,
                      onDelete: handleDeleteArticle,
                      currentUser,
                    })}
                    dataSource={getFilteredArticles()}
                    rowKey="articleId"
                    loading={articleLoading}
                    pagination={{ pageSize: 8 }}
                    bordered
                  />
                ) : tab.key === "Tin tức" ? (
                  <Table
                    className="admin-blog-table"
                    columns={BlogTableColumns({
                      activeTab: "Tin tức",
                      userMap,
                      onView: handleViewNews,
                      onEdit: handleEditNews,
                      onDelete: handleDeleteNews,
                      currentUser,
                    })}
                    dataSource={getFilteredNews()}
                    rowKey={(record) => getNewsId(record) || record.title}
                    loading={newsLoading}
                    pagination={{ pageSize: 8 }}
                    bordered
                  />
                ) : null}
              </>
            ),
          }))}
        />
      </Card>
      <BlogEditModal
        visible={editModalVisible}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        editImage={editImage}
        tags={tags}
        tagsLoading={tagsLoading}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={async () => {
          try {
            const values = await form.validateFields();

            const currentUserId =
              currentUser?.id || currentUser?.userId || currentUser?.userID;

            if (activeTab === "Tài liệu") {
              if (selectedBlog && selectedBlog.articleId) {
                const updateData = {
                  ...values,
                  tagIds: values.tags || [],
                  imgUrl: editImage,
                  userId: currentUserId,
                };
                await bloodArticleService.updateArticle(
                  selectedBlog.articleId,
                  updateData
                );
                message.success("Cập nhật bài viết thành công!");
              } else {
                const createData = {
                  ...values,
                  tagIds: values.tags || [],
                  imgUrl: editImage,
                  userId: currentUserId,
                };
                await bloodArticleService.createArticle(createData);
                message.success("Tạo bài viết thành công!");
              }
              const articlesData = await bloodArticleService.getBloodArticles();
              setArticles(Array.isArray(articlesData) ? articlesData : []);
            } else if (activeTab === "Tin tức") {
              if (selectedBlog && getNewsId(selectedBlog)) {
                const newsId = getNewsId(selectedBlog);
                const updateData = {
                  ...values,
                  tagIds: values.tags || [],
                  imgUrl: editImage,
                  userId: currentUserId,
                };
                await newsService.updateNews(newsId, updateData);
                message.success("Cập nhật bài viết tin tức thành công!");
              } else {
                const createData = {
                  ...values,
                  tagIds: values.tags || [],
                  imgUrl: editImage,
                  userId: currentUserId,
                };
                await newsService.createNews(createData);
                message.success("Tạo bài viết tin tức thành công!");
              }
              const data = await newsService.fetchAllNews();
              setNews(Array.isArray(data) ? data : []);
            }
            setEditModalVisible(false);
          } catch (error) {
            console.error("Error saving:", error);
            message.error("Có lỗi xảy ra khi lưu bài viết!");
            // Đảm bảo modal đóng ngay cả khi có lỗi
            setEditModalVisible(false);
          }
        }}
        onImageChange={setEditImage}
        form={form}
      />
      <BlogDetailModal
        visible={detailModalVisible}
        selectedBlog={selectedBlog}
        activeTab={activeTab}
        userMap={userMap}
        onClose={() => setDetailModalVisible(false)}
        onDelete={(id) => {
          setDetailModalVisible(false);
          if (activeTab === "Tài liệu") {
            handleDeleteArticle(id);
          } else {
            handleDeleteNews(id);
          }
        }}
      />
    </DoctorLayout>
  );
};

export default BlogManagement;
