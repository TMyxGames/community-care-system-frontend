import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import request from "@/utils/request";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orderList: [],
    loading: false,
  }),
  actions: {
    async getOrderList() {
      const authStore = useAuthStore();
      const userId = authStore.userInfo?.id;
      if (!userId) return;

      this.loading = true;
      try {
        const res = await request.get('/order/get', {
            params: { userId }
        });
        const result = res.data;
        this.orderList = result.data;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }
    
    }
  }
})