import React from "react";
import ManagerLayout from "../../components/manager/ManagerLayout";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "../../styles/pages/ManagerHomePage.scss";

const ManagerHomePage = () => {
  // Dữ liệu giả lập cho dashboard
  const dashboardStats = {
    requests: 45,
    bloodStock: 1200,
    notifications: 5,
  };

  return (
    <ManagerLayout pageTitle="BẢNG ĐIỀU KHIỂN">
      <div className="manager-home-page">
        <section className="dashboard-section">
          <h1 className="dashboard-title">BẢNG ĐIỀU KHIỂN</h1>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Yêu cầu</h3>
              <p>{dashboardStats.requests}</p>
            </div>
            <div className="stat-card">
              <h3>Kho máu</h3>
              <p>{dashboardStats.bloodStock} mL</p>
            </div>
            <div className="stat-card">
              <h3>Thông báo</h3>
              <p>{dashboardStats.notifications}</p>
            </div>
          </div>
          <div className="dashboard-content">
            <p>
              Chào mừng bạn đến với trang quản lý! Vui lòng kiểm tra các yêu
              cầu, quản lý kho máu, và xử lý thông báo mới nhất.
            </p>
          </div>
        </section>
        <Footer />
      </div>
      <ScrollToTop />
    </ManagerLayout>
  );
};

export default ManagerHomePage;
