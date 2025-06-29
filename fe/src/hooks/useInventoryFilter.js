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
    if (filters.isRare && filters.isRare !== "all") {
      filtered = filtered.filter((item) => {
        if (filters.isRare === "true") return item.isRare === true;
        if (filters.isRare === "false") return item.isRare === false;
        return true;
      });
    }
    return filtered;
  }, [inventory, filters]);
}
