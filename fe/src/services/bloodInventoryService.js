import axios from "axios";

const API_URL = import.meta.env.VITE_BLOOD_INVENTORY_API;

export const fetchBloodInventory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const checkInBloodInventory = async (payload) => {
  const response = await axios.post(
    "https://localhost:7021/api/BloodInventory/check-in",
    payload
  );
  return response.data;
};

export const checkOutBloodInventory = async (payload) => {
  const response = await axios.post(
    "https://localhost:7021/api/BloodInventory/check-out",
    payload
  );
  return response.data;
};
