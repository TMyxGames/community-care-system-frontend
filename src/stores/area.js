import { defineStore } from 'pinia';
import axios from 'axios';

export const useAreaStore = defineStore('area', {
  state: () => ({
    areaList: [],
    loading: false,
  }),
  actions: {
    // 获取所有区域
    async getAllAreas() {
        this.loading = true;
        try {
            const res = await axios.get('/area/all');
            this.areaList = res.data;
            return res.data;
        } catch (error) {
            console.error('获取区域列表失败：', error);
        } finally {
            this.loading = false;
        }
    },
    // 删除区域
    async removeArea(id) {
        try {
            const res = await axios.delete(`/area/delete/${id}`);
            if(res.status === 200) {
                this.areaList = this.areaList.filter(area => area.id !== id);
                return true;
            }
        } catch (error) {
            console.error('删除区域失败：', error);
            return false;
        }
    },
  }
  
});