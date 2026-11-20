import api from "./axios";

export const stockIn = (data) => api.post("/stock/in", data);
export const stockOut = (data) => api.post("/stock/out", data);
