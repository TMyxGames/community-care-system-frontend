import { defineStore } from 'pinia'
import { useAuthStore } from './auth';
import request from '@/utils/request';

export const useHealthStore = defineStore('health', {
  state: () => ({
    boundList: [], // 绑定列表
    healthDataList: [], // 健康数据列表
    currentSelection: 1, // 当前选择的用户(默认第一个)
    loading: false, // 加载状态
  }),
  actions: {
    // 获取绑定列表
    async getBoundList() { 
      const authStore = useAuthStore();
      // 如果当前登录用户的身份不是老人
      if ( authStore.userInfo.role !== 3) {
        try {
          // 获取绑定列表并设置当前选择的用户为第一个用户
          const res = await request.get('/auth/bindings');
          this.boundList = res;
          this.setUserId(res[0].id);
        } catch (error) {
          console.error("绑定列表加载失败", error);
        }
      } else { 
        // 否则不获取绑定列表，直接设置当前选择的用户为当前登录用户
        this.boundList = [];
        this.setUserId(authStore.userInfo.id);
      }

    },
    // 获取基本信息
    async getAllData() {
      if (!this.currentSelection) {
        console.warn('未找到用户ID');
        return;
      }

      this.loading = true;
      try {
        const res = await request.get('/health/get', {
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