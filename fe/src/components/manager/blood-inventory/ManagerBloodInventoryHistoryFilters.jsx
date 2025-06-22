import { DatePicker, Select } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ManagerBloodInventoryHistoryFilters({
  filters,
  setFilters,
  inventory = [],
  performers = [],
}) {
  const bloodOptions = inventory
    .filter((item) => item.bloodType)
    .map((item) => ({
      value: item.bloodType,
      label: `${item.bloodType} - ${item.componentType}`,
    }));

  return (
    <div
      style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
    >
      <RangePicker
        value={filters.dateRange}
        onChange={(val) => setFilters((f) => ({ ...f, dateRange: val }))}
        style={{ minWidth: 220 }}
        format="DD/MM/YYYY"
        placeholder={["Từ ngày", "Đến ngày"]}
      />
      <Select
        allowClear
        showSearch
        style={{ minWidth: 200 }}
        placeholder="Nhóm máu"
        value={filters.bloodType || undefined}
        onChange={(val) => setFilters((f) => ({ ...f, bloodType: val }))}
        optionFilterProp="label"
        options={bloodOptions}
      />
      <Select
        allowClear
        showSearch
        style={{ minWidth: 200 }}
        placeholder="Người thực hiện"
        value={filters.performedBy || undefined}
        onChange={(val) => setFilters((f) => ({ ...f, performedBy: val }))}
        optionFilterProp="children"
      >
        {performers.map((u) => (
          <Option key={u.id || u._id} value={u.id || u._id}>
            {u.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
