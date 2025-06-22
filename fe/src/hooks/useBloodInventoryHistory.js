import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function useBloodInventoryHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    performedBy: "",
    bloodType: "",
  });

  const fetchHistory = useCallback(() => {
    setLoading(true);
    axios
      .get("https://localhost:7021/api/BloodInventory/history/all")
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Danh sách performer duy nhất
  const performers = useMemo(() => {
    const map = new Map();
    history.forEach((h) => {
      if (h.performedBy) {
        const id = h.performedBy.userId || h.performedBy.id;
        if (id && !map.has(id)) {
          map.set(id, { id, name: h.performedBy.name || id });
        }
      }
    });
    return Array.from(map.values());
  }, [history]);

  // Danh sách bloodType duy nhất (cho filter nhóm máu)
  const inventory = useMemo(() => {
    const map = new Map();
    history.forEach((h) => {
      const bloodType = `${h.bloodGroup}${h.rhType === "Rh+" ? "+" : "-"}`;
      if (!map.has(bloodType)) {
        map.set(bloodType, {
          bloodType,
          bloodGroup: h.bloodGroup,
          rhType: h.rhType,
          componentType: h.componentType,
        });
      }
    });
    return Array.from(map.values());
  }, [history]);

  // Lọc dữ liệu
  const filteredHistory = useMemo(
    () =>
      history.filter((item) => {
        let pass = true;
        if (filters.dateRange && filters.dateRange.length === 2) {
          const [start, end] = filters.dateRange;
          const performedAt = dayjs(item.performedAt);
          if (
            performedAt.isBefore(start.startOf("day")) ||
            performedAt.isAfter(end.endOf("day"))
          )
            pass = false;
        }
        if (filters.performedBy) {
          const id = String(
            item.performedBy?.userId || item.performedBy?.id || ""
          );
          if (id !== String(filters.performedBy)) pass = false;
        }
        if (filters.bloodType) {
          const type = `${item.bloodGroup}${item.rhType === "Rh+" ? "+" : "-"}`;
          if (type !== filters.bloodType) pass = false;
        }
        return pass;
      }),
    [history, filters]
  );

  return {
    history,
    loading,
    filters,
    setFilters,
    filteredHistory,
    performers,
    inventory,
    fetchHistory,
    setHistory,
  };
}
