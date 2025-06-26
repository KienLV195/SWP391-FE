import React, { useState } from "react";
import { Layout } from "antd";
import ManagerSidebar from "./ManagerSidebar";
import "../../styles/base/manager-design-system.scss";

const { Content } = Layout;

const ManagerLayout = ({ children }) => {
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
          <div className="manager-page-content">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
