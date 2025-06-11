import React from "react";
import { Typography, Space, Button } from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const PageHeader = ({
  title,
  description,
  icon: IconComponent,
  actions = [],
  className = "",
  style = {},
}) => {
  return (
    <div className={`manager-page-header ${className}`} style={style}>
      <div className="header-info">
        <div className="header-title-section">
          {IconComponent && (
            <div className="header-icon">
              <IconComponent />
            </div>
          )}
          <div className="header-text">
            <Title level={2} className="header-title">
              {title}
            </Title>
            {description && (
              <Text className="header-description">{description}</Text>
            )}
          </div>
        </div>
      </div>
      
      {actions.length > 0 && (
        <div className="header-actions">
          <Space size="middle" wrap>
            {actions.map((action, index) => (
              <Button
                key={index}
                type={action.type || "default"}
                icon={action.icon}
                onClick={action.onClick}
                loading={action.loading}
                disabled={action.disabled}
                size={action.size || "default"}
                className={action.className || ""}
                style={action.style || {}}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      type: PropTypes.string,
      icon: PropTypes.node,
      loading: PropTypes.bool,
      disabled: PropTypes.bool,
      size: PropTypes.string,
      className: PropTypes.string,
      style: PropTypes.object,
    })
  ),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PageHeader;
