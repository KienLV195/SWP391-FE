import React, { useState, useCallback } from "react";
import axios from "axios";

const useRequest = (apiFn, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (typeof apiFn === "string") {
        // Nếu truyền vào là url string, tự động dùng axios.get
        const res = await axios.get(apiFn);
        result = res.data;
      } else {
        // Nếu là function, gọi như cũ (có thể trả về promise từ axios)
        result = await apiFn();
        // Nếu trả về response của axios, lấy .data
        if (result && result.data !== undefined) result = result.data;
      }
      setData(result);
    } catch (err) {
      setError(err?.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, deps);

  // Tự động fetch khi deps thay đổi
  React.useEffect(() => {
    requestData();
  }, deps);

  return { data, loading, error, refetch: requestData };
};

export default useRequest;
