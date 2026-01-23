import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import axios from "axios";

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
        const res = await axios.get('/order/get', {
            params: { userId }
        });
        this.orderList = res.data;
      } catch (error) {
        console.log("订单加载失败：", error);
      } finally {
        this.loading = false;
      }
    
    }
  }
})