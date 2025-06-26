import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/shared/AdminCard";
import AdminReports from "../../components/admin/reports/AdminReports";

const Reports = () => {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Báo cáo & Thống kê"
        subtitle="Xem các báo cáo và thống kê của hệ thống"
      />

      <AdminCard>
        <AdminReports />
      </AdminCard>
    </AdminLayout>
  );
};

export default Reports;
