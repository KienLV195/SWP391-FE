import React from "react";
import { Card } from "antd";

const AdminCard = ({
  children,
  style = {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    boxShadow: "0 4px 24px #e6e6e6",
    borderRadius: 16,
    border: "1px solid #f0f0f0",
    background: "#fcfcfc",
  },
  ...props
}) => (
  <Card style={style} {...props}>
    {children}
  </Card>
);

export default AdminCard;
