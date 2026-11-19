export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = localStorage.getItem("algoatlas_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...additionalHeaders,
  };
};
