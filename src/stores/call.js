import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import request from "@/utils/request";

export const useCallStore = defineStore("call", {
  state: () => ({
    callList: [],
    isLoading: false,
  }),
  actions: {
    async getCallList() {
      const authStore = useAuthStore();
      this.isLoading = true;
      this.callList = [];

      try {
        const res = await request.get("/security/call/all", {
          params: { role: authStore.userInfo.role }
        });
        this.callList = res;
        console.log("紧急呼叫记录加载成功：", res);
      } catch (error) {
        console.log("紧急呼叫记录加载失败：", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
})