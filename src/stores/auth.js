import { defineStore } from 'pinia'
import { useHealthStore } from './health';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 从 localStorage 读取，确保刷新页面不丢失登录态
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null, // 登录的用户信息
    isLoggedIn: !!localStorage.getItem('userInfo'), // 是否登录
  }),
  actions: {
    // 登录成功后的持久化
    login(user) {
      this.userInfo = user;
      this.isLoggedIn = true;
      localStorage.setItem('userInfo', JSON.stringify(user));
    },
    // 登出清理
    logout() {
      this.userInfo = null;
      this.isLoggedIn = false;
      localStorage.removeItem('userInfo');

      // 清理健康数据(执行health里的resetData)
      const healthStore = useHealthStore();
      healthStore.resetData();


    }
  },
  getters: {
    // 只有后端返回的 isAdmin 为 true 才具备管理员身份
    isAdminUser: (state) => state.userInfo?.isAdmin === true
  }
})