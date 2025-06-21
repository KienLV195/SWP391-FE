import { useState, useEffect } from "react";
import { message } from "antd";
import useSearchAndFilter from "./useSearchAndFilter";

export const useAdminPage = ({
  fetchData,
  searchFields = ["title", "name"],
  filterField = null,
  filterFn = null,
  searchFn = null,
  debounceMs = 300,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Search and filter logic
  const { searchTerm, setSearchTerm, filter, setFilter, filteredData } =
    useSearchAndFilter(data, {
      searchFields,
      filterField,
      filterFn,
      searchFn,
      debounceMs,
    });

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      message.error("Không thể tải dữ liệu!");
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD handlers
  const handleView = (item) => {
    setSelectedItem(item);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (deleteFunction, itemId) => {
    try {
      await deleteFunction(itemId);
      message.success("Xóa thành công!");
      loadData(); // Reload data
    } catch (error) {
      message.error("Xóa thất bại!");
      console.error("Delete error:", error);
    }
  };

  const handleSubmit = async (submitFunction, values) => {
    try {
      await submitFunction(values);
      message.success(
        editMode ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      setShowModal(false);
      setSelectedItem(null);
      setEditMode(false);
      loadData(); // Reload data
    } catch (error) {
      message.error(editMode ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
      console.error("Submit error:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditMode(false);
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    // State
    data: filteredData,
    loading,
    searchTerm,
    filter,
    showModal,
    selectedItem,
    editMode,

    // Setters
    setSearchTerm,
    setFilter,
    setShowModal,
    setSelectedItem,
    setEditMode,

    // Handlers
    handleView,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCloseModal,
    loadData,
  };
};
