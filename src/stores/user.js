import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [], // 所有用户列表
    allStaff: [], // 所有服务人员
    loading: false
  }),
  actions: {
    // 获取所有服务人员
    async getStaffList() {
      this.loading = true;
      try {
        const res = await axios.get('/user/staff/all');
        this.allStaff = res.data;
      } catch (error) {
        console.error("获取服务人员列表失败", error);
      } finally {
        this.loading = false;
      }
    },
    // 更新人员的配置
    async updateStaffConfig(payload) {
      try {
        const res = await axios.put(`/user/staff/config`, payload);

        return res.status === 200;
      } catch (error) {
        return false;
      }
    }
  }
});