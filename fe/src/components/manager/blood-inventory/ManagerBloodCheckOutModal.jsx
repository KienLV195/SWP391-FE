import { Modal, Select, InputNumber, Input, Row, Col } from "antd";
const { Option } = Select;

const BLOOD_GROUPS = ["A", "B", "AB", "O"];
const RH_TYPES = ["Rh+", "Rh-"];
const COMPONENT_TYPES = ["Hồng cầu", "Huyết tương", "Tiểu cầu", "Toàn phần"];
const BAG_TYPES = ["250ml", "350ml", "450ml"];

export default function ManagerBloodCheckOutModal({
  open,
  onOk,
  onCancel,
  confirmLoading,
  form,
  setForm,
}) {
  return (
    <Modal
      title="Xuất kho máu"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xuất kho"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
      okButtonProps={{
        disabled:
          !form.bloodGroup ||
          !form.rhType ||
          !form.componentType ||
          !form.bagType ||
          !form.quantity,
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <label>Nhóm máu:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn nhóm máu"
            value={form.bloodGroup || undefined}
            onChange={(val) => setForm((f) => ({ ...f, bloodGroup: val }))}
          >
            {BLOOD_GROUPS.map((group) => (
              <Option key={group} value={group}>
                {group}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <label>Rh:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Rh"
            value={form.rhType || undefined}
            onChange={(val) => setForm((f) => ({ ...f, rhType: val }))}
          >
            {RH_TYPES.map((rh) => (
              <Option key={rh} value={rh}>
                {rh}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <label>Thành phần:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn thành phần"
            value={form.componentType || undefined}
            onChange={(val) => setForm((f) => ({ ...f, componentType: val }))}
          >
            {COMPONENT_TYPES.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <label>Loại túi:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn loại túi"
            value={form.bagType || undefined}
            onChange={(val) => setForm((f) => ({ ...f, bagType: val }))}
          >
            {BAG_TYPES.map((b) => (
              <Option key={b} value={b}>
                {b}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <label>Số lượng:</label>
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            value={form.quantity}
            onChange={(val) => setForm((f) => ({ ...f, quantity: val }))}
          />
        </Col>
        <Col span={24}>
          <label>Ghi chú:</label>
          <Input.TextArea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </Col>
      </Row>
    </Modal>
  );
}
