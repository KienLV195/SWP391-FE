import React from "react";
import { Modal } from "antd";

const DeleteUserModal = ({ visible, onOk, onCancel }) => (
  <Modal
    open={visible}
    title="Xác nhận xoá người dùng"
    onOk={onOk}
    onCancel={onCancel}
    okText="Xoá"
    okButtonProps={{ danger: true }}
    cancelText="Huỷ"
  >
    <p>Bạn có chắc chắn muốn xoá người dùng này không?</p>
  </Modal>
);

export default DeleteUserModal;
