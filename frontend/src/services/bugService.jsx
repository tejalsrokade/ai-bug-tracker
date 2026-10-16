
import api from "./api";

export const getBugStats = () =>
  api.get("/bugs/stats");

export const getBugs = (params = {}) =>
  api.get("/bugs/search", { params });

export const getBugById = (id) =>
  api.get(`/bugs/${id}`);

export const createBug = (bugData) =>
  api.post("/bugs", bugData);

export const updateBug = (id, bugData) =>
  api.put(`/bugs/${id}`, bugData);

export const deleteBug = (id) =>
  api.delete(`/bugs/${id}`);


export const analyzeLog = (analysisData) =>
  api.post("/analysis", analysisData);