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
    // 更新人员的所属区域
    async assignArea(userId, areaId) {
      try {
        await axios.put(`/user/staff/assign-area`, { userId, areaId });
        // 同步更新本地状态，避免重新请求后端
        const user = this.allStaff.find(u => u.id === userId);
        if (user) user.serviceAreaId = areaId;
        return true;
      } catch (error) {
        return false;
      }
    }
  }
});