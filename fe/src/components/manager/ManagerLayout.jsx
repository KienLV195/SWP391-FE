import React, { useState } from "react";
import { Layout } from "antd";
import ManagerSidebar from "./ManagerSidebar";
import PageHeader from "./PageHeader";
import "../../styles/base/manager-design-system.scss";

const { Content } = Layout;

const ManagerLayout = ({
  children,
  pageTitle,
  pageDescription,
  pageIcon,
  pageActions = [],
  className = "",
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <ManagerSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        style={{
          marginLeft: collapsed ? "80px" : "280px",
          transition: "all 0.3s",
        }}
      >
        <Content
          className="manager-content"
          style={{
            padding: "24px",
            minHeight: "100vh",
            background: "#f5f5f5",
          }}
        >
          {(pageTitle || pageDescription || pageActions.length > 0) && (
            <PageHeader
              title={pageTitle}
              description={pageDescription}
              icon={pageIcon}
              actions={pageActions}
              style={{ marginBottom: 24 }}
            />
          )}

          <div className="manager-page-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
