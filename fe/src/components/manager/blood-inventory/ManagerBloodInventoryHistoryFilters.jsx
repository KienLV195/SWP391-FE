import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function ManagerBloodInventoryHistoryFilters({
  filters,
  setFilters,
  // inventory = [],
  // performers = [],
}) {
  // const bloodOptions = inventory
  //   .filter((item) => item.bloodType)
  //   .map((item) => ({
  //     value: item.bloodType,
  //     label: `${item.bloodType} - ${item.componentType}`,
  //   }));

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
    </div>
  );
}
