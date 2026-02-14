import { defineStore } from 'pinia'
import { useHealthStore } from './health';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 从 localStorage 读取，确保刷新页面不丢失登录态
    token: localStorage.getItem('token') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    activeRole: localStorage.getItem('activeRole') !== null
                ? Number(localStorage.getItem('activeRole'))
                : 0, // 用户使用的登录身份
    isLoggedIn: !!localStorage.getItem('userInfo'), // 是否登录
  }),
  actions: {
    // 登录成功后的持久化
    login(user, selectedRole, token) {
      this.userInfo = user;
      this.token = token;

      const roleToStore = (selectedRole !== undefined && selectedRole !== null) ? Number(selectedRole) : 0;
      this.activeRole = roleToStore;

      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('activeRole', this.activeRole);
      this.isLoggedIn = true;
    },
    // 登出清理
    logout() {
      this.userInfo = null;
      this.token = null;
      this.activeRole = 0;
      this.isLoggedIn = false;
      
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('activeRole');

      // 清理健康数据(执行health里的resetData)
      const healthStore = useHealthStore();
      healthStore.resetData();


    }
  },
  getters: {
    // 是否为家属
    isNormalUser: (state) => state.userInfo?.role === 0,

    // 是否为老人
    isNormalUser: (state) => state.userInfo?.role === 3,

    // 是否为管理员
    isAdminUser: (state) => Number(state.activeRole) === 1,

    // 是否为服务人员
    isStaffUser: (state) => Number(state.activeRole) === 2,

    // 获取身份名称
    roleName: state => {
      const roles = { 0: '家属', 1: '管理员', 2: '服务人员', 3: '老人'};
      return roles[state.userInfo?.role] || '游客';
    }
  }
})