import { defineStore } from 'pinia';
import request from '@/utils/request';

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
        const res = await request.get('/user/staff/all');
        this.allStaff = res || [];
      } catch (error) {
        this.allStaff = [];
        console.error("获取服务人员列表失败", error);
      } finally {
        this.loading = false;
      }
    },
    // 更新人员的配置
    async updateStaffConfig(payload) {
      try {
        const res = await request.put(`/user/staff/config`, payload);

        return res;
      } catch (error) {
        return false;
      }
    },

  }

});