import { defineStore } from "pinia";
import request from "@/utils/request";
import { ref } from 'vue'

export const useArticleStore = defineStore("article", () => {
  const articleList = ref([]);
  const currentArticle = ref(null);
  const isLoading = ref(false);

  // 获取所有已发布文章
  const getPublished = async () => {
    isLoading.value = true;
    articleList.value = [];

    try {
      const res = await request.get('/article/published');
      articleList.value = res;
    } catch (error) {
      console.log("已发布文章列表加载失败：", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 获取所有草稿
  const getDrafts = async () => {
    isLoading.value = true
    articleList.value = [];

    try {
      const res = await request.get('/article/drafts');
      articleList.value = res;
    } catch (error) {
      console.log("草稿列表加载失败：", error);
    } finally {
      isLoading.value = false;
    }
  };












  return {
    articleList,
    currentArticle,
    isLoading,
    getPublished,
    getDrafts,
  }
})