import api from "./axios";

export const getMovementReport = (params) =>
  api.get("/reports/movement", { params });
