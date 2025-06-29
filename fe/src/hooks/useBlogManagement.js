import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import * as bloodArticleService from "../services/bloodArticleService";
import * as newsService from "../services/newsService";
import * as userApi from "../services/userApi";
import * as activityLogService from "../services/activityLogService";
import dayjs from "dayjs";

export const useBlogManagement = (showActivityLogs = false, currentUser) => {
  const [activeTab, setActiveTab] = useState("Tài liệu");
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Polling ref for activity logs
  const pollingIntervalRef = useRef(null);

  const CATEGORY_OPTIONS = [
    { value: "Tài liệu", label: "Tài liệu" },
    { value: "Tin tức", label: "Tin tức" },
    ...(showActivityLogs
      ? [{ value: "Theo dõi hoạt động", label: "Theo dõi hoạt động" }]
      : []),
  ];

  // Fetch activity logs function
  const fetchActivityLogs = async () => {
    try {
      const activityLogsData = await activityLogService.getActivityLogs();
      const logsArray = Array.isArray(activityLogsData) ? activityLogsData : [];
      setActivityLogs(logsArray);
      return logsArray;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setActivityLogs([]);
      return [];
    }
  };

  // Polling effect for activity logs
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Start polling only when on activity logs tab
    if (activeTab === "Theo dõi hoạt động") {
      // Set up polling every 3 seconds for more responsive updates
      pollingIntervalRef.current = setInterval(() => {
        fetchActivityLogs();
      }, 3000);
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [activeTab]);

  // Fetch data based on active tab
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        if (activeTab === "Tài liệu") {
          const articlesData = await bloodArticleService.getBloodArticles();
          setArticles(Array.isArray(articlesData) ? articlesData : []);
        } else if (activeTab === "Tin tức") {
          const newsData = await newsService.fetchAllNews();
          setNews(Array.isArray(newsData) ? newsData : []);
        } else if (activeTab === "Theo dõi hoạt động") {
          // Fetch activity logs immediately when switching to this tab
          await fetchActivityLogs();
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        message.error(`Không thể tải danh sách ${activeTab.toLowerCase()}`);
        // Set empty array on error
        if (activeTab === "Tài liệu") {
          setArticles([]);
        } else if (activeTab === "Tin tức") {
          setNews([]);
        } else if (activeTab === "Theo dõi hoạt động") {
          setActivityLogs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Fetch users for mapping
  useEffect(() => {
    userApi
      .getUsers()
      .then((users) => {
        const map = {};
        if (Array.isArray(users)) {
          users.forEach((user) => {
            const userId = user.userId || user.userID || user.id;
            const userName =
              user.name ||
              user.fullName ||
              user.username ||
              user.email ||
              `User ${userId}`;
            map[userId] = userName;
          });
        }
        setUserMap(map);
      })
      .catch(() => {
        setUserMap({});
      });
  }, []);

  // Get current data
  const getCurrentData = () => {
    switch (activeTab) {
      case "Tài liệu":
        return Array.isArray(articles) ? articles : [];
      case "Tin tức":
        return Array.isArray(news) ? news : [];
      case "Theo dõi hoạt động":
        return Array.isArray(activityLogs) ? activityLogs : [];
      default:
        return Array.isArray(articles) ? articles : [];
    }
  };

  // Filter data
  const getFilteredData = () => {
    let data = getCurrentData();

    // Search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter((item) => {
        if (activeTab === "Theo dõi hoạt động") {
          const textMatch = [
            "description",
            "activityType",
            "entityType",
            "userName",
            "roleName",
          ].some((field) => {
            const value = item[field];
            if (!value) return false;
            return value.toLowerCase().includes(lowerTerm);
          });

          const dateMatch =
            item.createdAt &&
            new Date(item.createdAt)
              .toLocaleDateString("vi-VN")
              .includes(lowerTerm);

          return textMatch || dateMatch;
        } else {
          const textMatch = ["title", "content", "tags"].some((field) => {
            const value = item[field];
            if (!value) return false;

            if (Array.isArray(value)) {
              return value.some((v) => {
                // Xử lý cả string và object tags
                const tagText =
                  typeof v === "object" && v.tagName ? v.tagName : v;
                return tagText.toLowerCase().includes(lowerTerm);
              });
            }

            return value.toLowerCase().includes(lowerTerm);
          });

          const dateMatch =
            (activeTab === "Tài liệu" ? item.createdAt : item.postedAt) &&
            new Date(activeTab === "Tài liệu" ? item.createdAt : item.postedAt)
              .toLocaleDateString("vi-VN")
              .includes(lowerTerm);

          return textMatch || dateMatch;
        }
      });
    }

    // Date filter
    if (dateFilter) {
      data = data.filter((item) => {
        let itemDate;

        if (activeTab === "Tài liệu") {
          itemDate = item.createdAt;
        } else if (activeTab === "Tin tức") {
          itemDate = item.postedAt;
        } else if (activeTab === "Theo dõi hoạt động") {
          itemDate = item.createdAt;
        }

        if (!itemDate) return false;

        const itemDay = dayjs(itemDate).startOf("day");
        const filterDay = dateFilter.startOf("day");

        return itemDay.isSame(filterDay);
      });
    }

    return data;
  };

  // Handlers
  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(true);
    setShowModal(true);
    setEditImage(blog.imgUrl);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(false);
    setShowModal(true);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      if (activeTab === "Tài liệu") {
        await bloodArticleService.deleteArticle(blogId);
        message.success("Xóa tài liệu thành công");
      } else if (activeTab === "Tin tức") {
        await newsService.deleteNews(blogId);
        message.success("Xóa tin tức thành công");
      }

      // Refresh data
      setLoading(true);
      const fetchData = async () => {
        try {
          if (activeTab === "Tài liệu") {
            const articlesData = await bloodArticleService.getBloodArticles();
            setArticles(Array.isArray(articlesData) ? articlesData : []);
          } else if (activeTab === "Tin tức") {
            const newsData = await newsService.fetchAllNews();
            setNews(Array.isArray(newsData) ? newsData : []);
          } else if (activeTab === "Theo dõi hoạt động") {
            const activityLogsData = await activityLogService.getActivityLogs();
            setActivityLogs(
              Array.isArray(activityLogsData) ? activityLogsData : []
            );
          }
        } catch (error) {
          console.error(`Error fetching ${activeTab}:`, error);
          // Set empty array on error
          if (activeTab === "Tài liệu") {
            setArticles([]);
          } else if (activeTab === "Tin tức") {
            setNews([]);
          } else if (activeTab === "Theo dõi hoạt động") {
            setActivityLogs([]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Không thể xóa bài viết");
    }
  };

  const handleEditSubmit = async (form) => {
    try {
      const values = await form.validateFields();
      const userId =
        currentUser?.id || currentUser?.userId || currentUser?.userID;

      if (activeTab === "Tài liệu") {
        const updateData = {
          ...values,
          imgUrl: editImage,
          userId,
          tagIds: values.tags || [],
        };
        await bloodArticleService.updateBlog(
          selectedBlog.articleId,
          updateData
        );
        message.success("Cập nhật tài liệu thành công");
      } else if (activeTab === "Tin tức") {
        const updateData = {
          ...values,
          imgUrl: editImage,
          userId,
          tagIds: values.tags || [],
        };
        await newsService.updateNews(selectedBlog.postId, updateData);
        message.success("Cập nhật tin tức thành công");
      }

      setShowModal(false);
      setSelectedBlog(null);
      setEditMode(false);
      setEditImage(null);
      form.resetFields();

      // Refresh data
      setLoading(true);
      const fetchData = async () => {
        try {
          if (activeTab === "Tài liệu") {
            const articlesData = await bloodArticleService.getBloodArticles();
            setArticles(Array.isArray(articlesData) ? articlesData : []);
          } else if (activeTab === "Tin tức") {
            const newsData = await newsService.fetchAllNews();
            setNews(Array.isArray(newsData) ? newsData : []);
          } else if (activeTab === "Theo dõi hoạt động") {
            const activityLogsData = await activityLogService.getActivityLogs();
            setActivityLogs(
              Array.isArray(activityLogsData) ? activityLogsData : []
            );
          }
        } catch (error) {
          console.error(`Error fetching ${activeTab}:`, error);
          // Set empty array on error
          if (activeTab === "Tài liệu") {
            setArticles([]);
          } else if (activeTab === "Tin tức") {
            setNews([]);
          } else if (activeTab === "Theo dõi hoạt động") {
            setActivityLogs([]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error("Không thể cập nhật bài viết");
      // Đảm bảo modal đóng ngay cả khi có lỗi
      setShowModal(false);
      setSelectedBlog(null);
      setEditMode(false);
      setEditImage(null);
      form.resetFields();
      throw error; // Re-throw để component cha có thể xử lý
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
    setEditMode(false);
    setEditImage(null);
  };

  return {
    // State
    activeTab,
    dateFilter,
    selectedBlog,
    showModal,
    editMode,
    editImage,
    userMap,
    searchTerm,
    loading,
    CATEGORY_OPTIONS,

    // Data
    articles,
    news,
    activityLogs,
    filteredData: getFilteredData(),

    // Setters
    setActiveTab,
    setDateFilter,
    setEditImage,
    setSearchTerm,

    // Handlers
    handleEditBlog,
    handleViewBlog,
    handleDeleteBlog,
    handleEditSubmit,
    handleCloseModal,
  };
};
