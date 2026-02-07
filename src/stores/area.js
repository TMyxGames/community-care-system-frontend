import { defineStore } from 'pinia';
import request from '@/utils/request';

export const useAreaStore = defineStore('area', {
  state: () => ({
    areaList: [],
    loading: false,
  }),
  actions: {
    // 获取所有服务区域
    async getAllServiceAreas() {
        this.loading = true;
        try {
            const res = await request.get('/area/service/all');
            this.areaList = res.data;
        } catch (error) {
            console.error('获取区域列表失败：', error);
        } finally {
            this.loading = false;
        }
    },
    // 删除服务区域
    async removeServiceArea(id) {
        try {
            const res = await request.delete(`/area/service/delete/${id}`);
            this.areaList = this.areaList.filter(area => area.id !== id);
            return true;
        } catch (error) {
            console.error('删除区域失败：', error);
            return false;
        }
    },

    // 获取所有安全区域
    async getAllSafeAreas() {
        this.loading = true;
        try {
            const res = await request.get('/area/safe/all');
            this.areaList = res;
            return res;
        } catch (error) {
            console.error('获取区域失败：', error);
        } finally {
            this.loading = false;
        }
    },
    // 删除安全区域
    async removeSafeArea(id) {
        try {
            const res = await request.delete(`/area/safe/delete/${id}`);
            this.areaList = this.areaList.filter(area => area.id !== id);
            return true;
        } catch (error) {
            console.error('删除区域失败：', error);
            return false;
        }
    },
  }
  
});