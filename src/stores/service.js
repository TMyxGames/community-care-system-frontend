import { defineStore } from 'pinia'
import request from '@/utils/request';

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
        const res = await request.get('/service/all');
        this.serviceList = res;
      } catch (error) {
        console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },
    // 获取服务详情
    async getServiceById(id) {
      try {
        const res = await request.get(`/service/${id}`);
        return res;
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