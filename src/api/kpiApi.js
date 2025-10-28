// KPI API functions
import apiClient from './client.js';
import { mockKpiData } from '../utils/mockData.js';

export const kpiApi = {
  // Fetch KPI data with fallback to mock data
  async getKpiData() {
    try {
      const response = await apiClient.get('/kpi/');
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Normalize backend data
        return response.data.map((item) => ({
          ...item,
          bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
        }));
      } else {
        throw new Error('No data received from backend');
      }
    } catch {
      console.log('KPI API unavailable, using fallback data');
      
      // Return mock data as fallback
      return mockKpiData.map((item) => ({
        ...item,
        bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
      }));
    }
  },

  // Create new KPI
  async createKpi(kpiData) {
    try {
      const response = await apiClient.post('/kpi/', kpiData);
      return response.data;
    } catch (error) {
      console.error('Failed to create KPI:', error);
      throw error;
    }
  },

  // Update KPI
  async updateKpi(id, kpiData) {
    try {
      const response = await apiClient.put(`/kpi/${id}/`, kpiData);
      return response.data;
    } catch (error) {
      console.error('Failed to update KPI:', error);
      throw error;
    }
  },

  // Delete KPI
  async deleteKpi(id) {
    try {
      await apiClient.delete(`/kpi/${id}/`);
      return true;
    } catch (error) {
      console.error('Failed to delete KPI:', error);
      throw error;
    }
  }
};