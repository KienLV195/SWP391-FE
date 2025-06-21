import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import useRequest from "./useFetchData";
import {
  getBloodArticles,
  deleteArticle,
  updateBlog,
} from "../services/bloodArticleService";
import { fetchAllNews } from "../services/newsService";
import useSearchAndFilter from "./useSearchAndFilter";
import { getUsers } from "../services/userApi";

const CATEGORY_OPTIONS = [
  { value: "Tài liệu", label: "Tài liệu" },
  { value: "Tin tức", label: "Tin tức" },
];

export const useBlogApproval = () => {
  // Fetch blogs (tài liệu)
  const {
    data: blogs = [],
    loading: blogsLoading,
    refetch: refetchBlogs,
  } = useRequest(getBloodArticles, []);

  // Fetch news (tin tức)
  const {
    data: news = [],
    loading: newsLoading,
    refetch: refetchNews,
  } = useRequest(fetchAllNews, []);

  // State management
  const [activeTab, setActiveTab] = useState("Tài liệu");
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [userMap, setUserMap] = useState({});

  // Custom filter function để xử lý category undefined
  const customFilterFn = useCallback(
    (item, filterValue) => {
      if (filterValue === "Tài liệu") {
        // Cho blogs: hiển thị blogs không có category hoặc category là "Tài liệu"
        return !item.category || item.category === "Tài liệu";
      } else if (filterValue === "Tin tức") {
        // Cho news: hiển thị tất cả news (không cần filter theo category)
        // Thêm filter theo ngày nếu có
        if (dateFilter) {
          const itemDate = new Date(item.postedAt);
          const filterDate = new Date(dateFilter);
          return itemDate.toDateString() === filterDate.toDateString();
        }
        return true;
      }
      return true;
    },
    [dateFilter]
  );

  // Sử dụng dữ liệu phù hợp với tab hiện tại
  const currentData = activeTab === "Tài liệu" ? blogs : news;
  const currentLoading = activeTab === "Tài liệu" ? blogsLoading : newsLoading;

  const {
    searchTerm,
    setSearchTerm,
    filter: activeTabFilter,
    setFilter: setActiveTabFilter,
    filteredData: filteredItems,
  } = useSearchAndFilter(currentData, {
    searchFields: ["title", "content", "tags"],
    filterField: "category",
    filterFn: customFilterFn,
    searchFn: (item, term) => {
      if (!term) return true;
      const lowerTerm = term.toLowerCase();

      // Search trong title, content, tags
      const textMatch = ["title", "content", "tags"].some((field) => {
        const value = item[field];
        if (!value) return false;

        if (Array.isArray(value)) {
          return value.some((v) => v.toLowerCase().includes(lowerTerm));
        }

        return value.toLowerCase().includes(lowerTerm);
      });

      // Search trong postedAt (ngày đăng)
      const dateMatch =
        item.postedAt &&
        new Date(item.postedAt).toLocaleDateString("vi-VN").includes(lowerTerm);

      return textMatch || dateMatch;
    },
    debounceMs: 300,
  });

  // Sync activeTab với filter
  useEffect(() => {
    if (!activeTabFilter) {
      setActiveTabFilter("Tài liệu");
    }
  }, [activeTabFilter, setActiveTabFilter]);

  // Sync activeTab với filter khi tab thay đổi
  useEffect(() => {
    setActiveTabFilter(activeTab);
  }, [activeTab, setActiveTabFilter]);

  // Fetch user map
  useEffect(() => {
    getUsers().then((users) => {
      const map = {};
      users.forEach((u) => {
        map[u.userId || u.userID || u.id] =
          u.name || u.fullName || u.username || u.email;
      });
      setUserMap(map);
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
        // TODO: Implement delete news when API is ready
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
    // State
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

    // Setters
    setActiveTab,
    setDateFilter,
    setEditImage,

    // Handlers
    handleEditBlog,
    handleDeleteBlog,
    handleEditSubmit,
    handleViewBlog,
    handleCloseModal,
    setSearchTerm,
  };
};
