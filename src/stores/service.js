import { defineStore } from 'pinia'
import axios from 'axios';

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceList: [],
    loading: false,
  }),
  actions: {
    // 获取所有服务
    async getAllServices() {
      this.loading = true;
      try {
        const res = await axios.get('/service/all');
        this.serviceList = res.data;
      } catch (error) {
        console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },
    // 获取服务详情
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