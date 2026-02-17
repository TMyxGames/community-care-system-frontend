import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import request from "@/utils/request";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orderList: [],
    loading: false,
  }),
  actions: {
    // 获取订单记录列表（用户）
    async getOrderList() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;
      this.orderList = [];
      try {
        const res = await request.get('/order/get');
        this.orderList = res;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }
    
    },

    // 获取待服务订单（服务人员）
    async getPendingOrder() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;
      this.orderList = [];
      try {
        const res = await request.get('/order/getPendingOrder');
        this.orderList = res;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }

    },

    // 获取进行中订单（服务人员）
    async getDoingOrder() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;
      this.orderList = [];
      try {
        const res = await request.get('/order/getDoingOrder');
        this.orderList = res;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }

    },

    // 获取历史服务订单（服务人员）
    async getHistoryOrder() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;
      this.orderList = [];
      try {
        const res = await request.get('/order/getHistoryOrder');
        this.orderList = res;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }

    }



  }
})