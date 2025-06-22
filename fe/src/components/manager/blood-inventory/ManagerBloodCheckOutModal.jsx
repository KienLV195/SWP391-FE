import { Modal, Select, InputNumber, Input } from "antd";
const { Option } = Select;

export default function ManagerBloodCheckOutModal({
  open,
  onOk,
  onCancel,
  confirmLoading,
  inventory,
  form,
  setForm,
}) {
  const getBloodLabel = (item) =>
    `${item.bloodGroup}${item.rhType === "Rh+" ? "+" : "-"}`;
  return (
    <Modal
      title="Xuất kho máu"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xuất kho"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: !form.inventoryId || !form.quantity }}
    >
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Chọn nhóm máu:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn nhóm máu"
            value={form.inventoryId || undefined}
            onChange={(val) =>
              setForm((f) => ({ ...f, inventoryId: String(val) }))
            }
            showSearch
            optionFilterProp="children"
          >
            {inventory
              .filter(
                (item) =>
                  item.inventoryId !== undefined && item.inventoryId !== null
              )
              .map((item) => (
                <Option
                  key={String(item.inventoryId)}
                  value={String(item.inventoryId)}
                >
                  {getBloodLabel(item)} - {item.componentType}
                </Option>
              ))}
          </Select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Số lượng xuất:</label>
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            value={form.quantity}
            onChange={(val) => setForm((f) => ({ ...f, quantity: val }))}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Lý do:</label>
          <Input
            style={{ width: "100%" }}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Ghi chú:</label>
          <Input
            style={{ width: "100%" }}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
}
