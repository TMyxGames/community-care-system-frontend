import { defineStore } from 'pinia'
import { useAuthStore } from './auth';
import request from '@/utils/request';

export const useHealthStore = defineStore('health', {
  state: () => ({
    currentSelection: 1, // 当前选择的用户(默认第一个)
    boundList: [], // 绑定列表
    healthDataList: [], // 健康数据列表
    loading: false, // 加载状态
  }),
  actions: {
    // 获取绑定列表
    async getBoundList(userId) { 
      const res = await request.get('/auth/bindings');
      this.boundList = res;

      // 设置当前选择的用户为用户自己
      this.setUserId(userId);

      // 如果绑定列表有数据，则设置绑定列表中的第一个用户ID
      // if (this.boundList.length > 0) {
      //   this.setUserId(this.boundList[0].id);
      // }
    },
    // 获取基本信息
    async getAllData() {
      // const authStore = useAuthStore();
      // const userId = authStore.userInfo?.id || this.currentSelection;
      // const selectionId = this.currentSelection

      if (!this.currentSelection) {
        console.warn('未找到用户ID');
        return;
      }

      this.loading = true;
      try {
        const res = await request.get('/health/getData', {
          params: { userId: this.currentSelection }
        });
          
        this.healthDataList = res;
          
      } catch (error) {
          console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },
    setUserId(id) {
      // if(this.currentUserId === id) return;
      this.currentSelection = id;
      this.healthDataList = [];
      this.getAllData();
    },
    // 重置数据
    resetData() {
      this.healthDataList = []; // 清空健康数据列表
      this.boundList = []; // 清空绑定列表
      this.currentSelection = null; // 重置当前选择的用户ID
      this.loading = false;
    }
  },
  getters: {
    userInfo: (state) => {
      return state.healthDataList.length > 0 ? state.healthDataList[0] : {};
    },

    latestData: (state) => {
      return state.healthDataList.length > 0 ? state.healthDataList[0] : null;
    },

    sevenDaysData: (state) => {
      return state.healthDataList.slice(0, 7);
    },
  },
})