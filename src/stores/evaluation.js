import { defineStore } from "pinia";
import { useServiceStore } from "./service";
import request from "@/utils/request";

export const useEvaluationStore = defineStore("evaluation", {
  state: () => ({
    evaluationList: [],
    isLoading: false
  }),
  actions: {
    async getEvaluationList(id) {
        this.isLoading = true
        try {
          const res = await request.get(`/evaluation/all/${id}`);
          this.evaluationList = res;
        } catch (error) {
          console.error("获取评论列表失败", error);
        } finally {
          this.isLoading = false;
        }
    }
  }
})