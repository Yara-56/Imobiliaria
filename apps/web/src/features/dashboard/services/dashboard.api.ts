import axios from "axios";
import { DashboardData } from "../types/dashboard.types";

export const dashboardApi = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await axios.get("/api/dashboard");
    return data;
  }
};