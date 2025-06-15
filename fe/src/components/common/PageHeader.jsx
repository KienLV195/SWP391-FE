import React from "react";
import { Typography, Space, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "../../styles/components/PageHeader.scss";

const { Title, Text } = Typography;

const PageHeader = ({
  title,
  description,
  icon,
  actions = [],
  breadcrumb,
  loading = false,
}) => {
  return (
    <div className="page-header">
      <div className="header-content">
        <div className="header-title-section">
          {icon && <span className="header-icon">{icon}</span>}
          <div>
            <Title level={4} className="header-title">
              {title}
            </Title>
            {description && (
              <Text type="secondary" className="header-description">
                {description}
              </Text>
            )}
          </div>
        </div>

        {breadcrumb && <div className="header-breadcrumb">{breadcrumb}</div>}

        <div className="header-actions">
          <Space>
            {actions.map((action, index) => (
              <Button
                key={index}
                type={action.type || "default"}
                icon={action.icon}
                onClick={action.onClick}
                loading={action.loading || loading}
                disabled={action.disabled}
                style={action.style}
              >
                {action.label}
              </Button>
            ))}
            {actions.length === 0 && (
              <Button
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                loading={loading}
              >
                Làm mới
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
