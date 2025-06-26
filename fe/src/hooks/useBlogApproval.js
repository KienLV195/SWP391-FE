import { useState, useEffect } from "react";
import { message } from "antd";
import useRequest from "./useFetchData";
import {
  getBloodArticles,
  deleteArticle,
  updateBlog,
} from "../services/bloodArticleService";
import { fetchAllNews } from "../services/newsService";
import { getActivityLogs } from "../services/activityLogService";
import useSearchAndFilter from "./useSearchAndFilter";
import { getUsers } from "../services/userApi";
import dayjs from "dayjs";

const CATEGORY_OPTIONS = [
  { value: "Tài liệu", label: "Tài liệu" },
  { value: "Tin tức", label: "Tin tức" },
  { value: "Theo dõi hoạt động", label: "Theo dõi hoạt động" },
];

export const useBlogApproval = () => {
  const {
    data: blogs = [],
    loading: blogsLoading,
    refetch: refetchBlogs,
  } = useRequest(getBloodArticles, []);

  const {
    data: news = [],
    loading: newsLoading,
    refetch: refetchNews,
  } = useRequest(fetchAllNews, []);

  const {
    data: activityLogs = [],
    loading: activityLogsLoading,
    refetch: refetchActivityLogs,
  } = useRequest(getActivityLogs, []);

  // State management
  const [activeTab, setActiveTab] = useState("Tài liệu");
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [userMap, setUserMap] = useState({});

  const customFilterFn = (item) => {
    if (dateFilter) {
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

      if (!itemDay.isSame(filterDay)) {
        return false;
      }
    }

    return true;
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "Tài liệu":
        return blogs;
      case "Tin tức":
        return news;
      case "Theo dõi hoạt động":
        return activityLogs;
      default:
        return blogs;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case "Tài liệu":
        return blogsLoading;
      case "Tin tức":
        return newsLoading;
      case "Theo dõi hoạt động":
        return activityLogsLoading;
      default:
        return blogsLoading;
    }
  };

  const currentData = getCurrentData();
  const currentLoading = getCurrentLoading();

  const {
    searchTerm,
    setSearchTerm,
    filter: activeTabFilter,
    setFilter: setActiveTabFilter,
    filteredData: filteredItems,
  } = useSearchAndFilter(currentData, {
    searchFields:
      activeTab === "Theo dõi hoạt động"
        ? ["description", "activityType", "entityType"]
        : ["title", "content", "tags"],
    filterField: activeTab === "Theo dõi hoạt động" ? null : "category",
    filterFn: customFilterFn,
    searchFn: (item, term) => {
      if (!term) return true;
      const lowerTerm = term.toLowerCase();

      if (activeTab === "Theo dõi hoạt động") {
        const textMatch = ["description", "activityType", "entityType"].some(
          (field) => {
            const value = item[field];
            if (!value) return false;
            return value.toLowerCase().includes(lowerTerm);
          }
        );

        const userMatch =
          userMap[item.userID] &&
          userMap[item.userID].toLowerCase().includes(lowerTerm);

        const dateMatch =
          item.createdAt &&
          new Date(item.createdAt)
            .toLocaleDateString("vi-VN")
            .includes(lowerTerm);

        return textMatch || userMatch || dateMatch;
      } else {
        const textMatch = ["title", "content", "tags"].some((field) => {
          const value = item[field];
          if (!value) return false;

          if (Array.isArray(value)) {
            return value.some((v) => v.toLowerCase().includes(lowerTerm));
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
    },
    debounceMs: 300,
  });

  useEffect(() => {
    if (!activeTabFilter) {
      setActiveTabFilter("Tài liệu");
    }
  }, [activeTabFilter, setActiveTabFilter]);

  useEffect(() => {
    setActiveTabFilter(activeTab);
  }, [activeTab, setActiveTabFilter]);

  useEffect(() => {
    getUsers()
      .then((users) => {
        const map = {};
        users.forEach((u) => {
          map[u.userId || u.userID || u.id] =
            u.name || u.fullName || u.username || u.email;
        });
        setUserMap(map);
      })
      .catch(() => {
        setUserMap({});
      });
  }, []);

  // Handlers
  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(true);
    setShowModal(true);
    setEditImage(blog.imgUrl);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      if (activeTab === "Tài liệu") {
        await deleteArticle(blogId);
        refetchBlogs();
      } else {
        message.warning("Tính năng xóa tin tức chưa được implement");
        refetchNews();
      }
      message.success("Đã xóa bài viết!");
      setShowModal(false);
    } catch {
      message.error("Xóa bài viết thất bại!");
    }
  };

  const handleEditSubmit = (form) => {
    form.validateFields().then(async (values) => {
      if (!values.title || !values.content) {
        message.error("Tiêu đề và nội dung không được để trống!");
        return;
      }
      try {
        if (activeTab === "Tài liệu") {
          await updateBlog(selectedBlog.articleId, {
            ...values,
            tags: Array.isArray(values.tags)
              ? values.tags.join(",")
              : values.tags,
            imgUrl: editImage,
          });
          refetchBlogs();
        } else {
          // TODO: Implement update news when API is ready
          message.warning("Tính năng chỉnh sửa tin tức chưa được implement");
          refetchNews();
        }
        setShowModal(false);
        message.success("Cập nhật bài viết thành công!");
      } catch {
        message.error("Cập nhật bài viết thất bại!");
      }
    });
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
    setEditMode(false);
    setEditImage(null);
  };

  return {
    activeTab,
    dateFilter,
    selectedBlog,
    showModal,
    editMode,
    editImage,
    userMap,
    searchTerm,
    filteredItems,
    currentLoading,
    CATEGORY_OPTIONS,

    setActiveTab,
    setDateFilter,
    setEditImage,

    handleEditBlog,
    handleDeleteBlog,
    handleEditSubmit,
    handleViewBlog,
    handleCloseModal,
    setSearchTerm,

    refetchActivityLogs,
  };
};
