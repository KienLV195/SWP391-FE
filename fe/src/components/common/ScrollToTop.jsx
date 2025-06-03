import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../../styles/components/ScrollToTop.scss";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Xử lý hiển thị nút khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300); // Hiển thị nút khi cuộn xuống hơn 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <div className="scroll-to-top-btn" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
