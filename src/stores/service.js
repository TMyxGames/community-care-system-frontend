import { defineStore } from 'pinia'
import axios from 'axios';

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    loading: false,
  }),
  actions: {
    async getAllServices() {
      this.loading = true;
      try {
        const res = await axios.get('/service/all');
        this.services = res.data;
      } catch (error) {
        console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },

    async getServiceById(id) {
      try {
        const res = await axios.get(`/service/${id}`);
        return res.data;
      } catch (error) {
        console.error("数据加载失败", error);
        return null;
      }
    }
  },
  getters: {
    hasService: (state) => {
      state.services.length > 0;
    }
  },
})