import { useMemo } from "react";

export default function useInventoryFilter(inventory, filters) {
  return useMemo(() => {
    let filtered = inventory;
    if (filters.bloodType && filters.bloodType !== "all") {
      filtered = filtered.filter(
        (item) => item.bloodType === filters.bloodType
      );
    }
    if (filters.component && filters.component !== "all") {
      filtered = filtered.filter(
        (item) => item.componentType === filters.component
      );
    }
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
    return filtered;
  }, [inventory, filters]);
}
