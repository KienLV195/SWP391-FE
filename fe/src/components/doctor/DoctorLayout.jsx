import React, { useState } from "react";
import { Layout } from "antd";
import DoctorSidebar from "./DoctorSidebar";
import PageHeader from "../manager/PageHeader";
import "../../styles/components/AdminLayout.module.scss";

const { Content } = Layout;

const DoctorLayout = ({
  children,
  pageTitle,
  pageDescription,
  pageIcon,
  pageActions = [],
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="admin-layout">
      <DoctorSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        className={`admin-main-layout ${collapsed ? "sidebar-collapsed" : ""}`}
        style={{
          minHeight: "100vh",
          marginLeft: collapsed ? 80 : 280,
          transition: "all 0.2s",
        }}
      >
        <Content className="admin-content">
          {(pageTitle || pageDescription || pageActions.length > 0) && (
            <PageHeader
              title={pageTitle}
              description={pageDescription}
              icon={pageIcon}
              actions={pageActions}
              style={{ marginBottom: 24 }}
            />
          )}

          <div className="admin-page-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;
