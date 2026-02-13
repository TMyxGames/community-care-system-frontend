import { defineStore } from "pinia";
import { useServiceStore } from "./service";
import request from "@/utils/request";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    commentList: [],
    isLoading: false
  }),
  actions: {
    async getCommentList(id) {
        this.isLoading = true
        try {
          const res = await request.get(`/comment/${id}`);
          this.commentList = res;
        } catch (error) {
          console.error("获取评论列表失败", error);
        } finally {
          this.isLoading = false;
        }
    }
  }
})