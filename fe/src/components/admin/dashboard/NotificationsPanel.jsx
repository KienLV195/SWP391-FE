import React from "react";
import { Card, List, Tag, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "../../../styles/components/admin/NotificationsPanel.scss";

const { Text } = Typography;

const NotificationsPanel = ({ notifications = [] }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning":
        return <WarningOutlined style={{ color: "#faad14" }} />;
      case "error":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
    }
  };

  const getNotificationTag = (type) => {
    const tagColors = {
      success: "success",
      warning: "warning",
      error: "error",
      info: "processing",
    };

    const tagTexts = {
      success: "Thành công",
      warning: "Cảnh báo",
      error: "Lỗi",
      info: "Thông tin",
    };

    return (
      <Tag color={tagColors[type] || "default"}>
        {tagTexts[type] || "Thông báo"}
      </Tag>
    );
  };

  return (
    <Card
      title={
        <div className="notifications-header">
          <BellOutlined />
          <span>Thông báo gần đây</span>
        </div>
      }
      className="notifications-panel"
      bordered={false}
    >
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="notification-item">
            <List.Item.Meta
              avatar={getNotificationIcon(item.type)}
              title={
                <div className="notification-title">
                  <Text strong>{item.title}</Text>
                  {getNotificationTag(item.type)}
                </div>
              }
              description={
                <div className="notification-content">
                  <Text>{item.message}</Text>
                  <Text type="secondary" className="notification-time">
                    {item.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default NotificationsPanel;
