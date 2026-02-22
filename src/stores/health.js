import { defineStore } from 'pinia'
import { useAuthStore } from './auth';
import request from '@/utils/request';

export const useHealthStore = defineStore('health', {
  state: () => ({
    boundList: [], // 绑定列表
    currentSelection: null, // 当前选择的用户(默认第一个)
    loading: false, // 加载状态

    summary: {
      age: 0,
      sex: '',
      latestBmi: null,
      latestBp: null,
      latestFastingBs: null,
      latestPostprandialBs: null,
    },
    bmiHistory: [],
    bpHistory: [],
    bsHistory: [],
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
      if (!this.currentSelection) return;
      
      this.loading = true;
      try {
        const res = await request.get('/health/get/summary', {
          params: { userId: this.currentSelection }
        });
        this.summary = res;
        console.log("基本信息为：", res);
      } catch (error) {
          console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },

    // 获取七天内BMI趋势
    async getBmiTrend() {
      if (!this.currentSelection) return;
      
      this.loading = true;
      try {
        const res = await request.get('/health/get/bmi/trend', {
          params: { userId: this.currentSelection }
        });
        this.bmiHistory = res;
        console.log("七天内bmi数据为：", res);
      } catch (error) {
          console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },

    // 获取七天内血压趋势
    async getBpTrend() {
      if (!this.currentSelection) return;
      
      this.loading = true;
      try {
        const res = await request.get('/health/get/bp/trend', {
          params: { userId: this.currentSelection }
        });
        this.bpHistory = res;
        console.log("七天内血压数据为：", res);
      } catch (error) {
          console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },

    // 获取七天内血糖趋势
    async getBsTrend() {
      if (!this.currentSelection) return;
      
      this.loading = true;
      try {
        const res = await request.get('/health/get/bs/trend', {
          params: { userId: this.currentSelection }
        });
        this.bsHistory = res;
        console.log("七天内血糖数据为：", res);
      } catch (error) {
          console.error("数据加载失败", error);
      } finally {
        this.loading = false;
      }
    },

    // 设置当前选择的用户ID
    setUserId(id) {
      if (this.currentSelection == id) return;
      this.currentSelection = id;
      this.summary = [];
      this.bmiHistory = [];
      this.bpHistory = [];
      this.bsHistory = [];
      this.getAllData();
    },

    // 重置数据
    resetData() {
      this.summary = [];
      this.bmiHistory = [];
      this.bpHistory = [];
      this.bsHistory = [];
      this.boundList = [];
      this.currentSelection = null;
      this.loading = false;
    }
  },
  getters: {
    userInfo: (state) => {
      return state.latestData || {};
    },

    // latestData: (state) => {
    //   return state.healthDataList.length > 0 ? state.healthDataList[0] : null;
    // },

    // sevenDaysData: (state) => {
    //   return state.healthDataList.slice(0, 7);
    // },
  },
})