import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { ref } from "vue";
import request from "@/utils/request";

export const useMessageStore = defineStore("message", { 
    state: () => ({ 
        sessionList: [], // 会话列表
        activeMessages: [], // 当前会话消息列表
        currentSessionId: null, // 当前会话对象
        isLoading: false,
        noMore: false,
    }),
    actions: { 
        // 获取会话列表
        async getSessionList() { 
            const res = await request.get('/session/all');

            this.sessionList = res;
        },

        // 获取会话的消息
        async getMessages(sessionId) {
            this.isLoading = true;
            this.noMore = false;
            this.activeMessages = [];
            try { 
                const data = await request.get(`/message/list/${sessionId}`);
                this.activeMessages = data;
            } catch (error) { 
                console.error('获取消息失败：', error);
            } finally { 
                this.isLoading = false;
            }
        },

        // 获取会话的历史消息
        async getHistory(sessionId) {
            if (this.isLoading || this.noMore) return [];
            
            this.isLoading = true;
            try {
                // 拿到当前缓存里最早的一条消息id
                const firstMsgId = this.activeMessages.length > 0 ? this.activeMessages[0].id : null;
                
                const res = await request.get(`/message/history/${sessionId}`, {
                    params: { beforeId: firstMsgId, limit: 20 }
                });

                if (res.length < 20) {
                    this.noMore = true;
                }

                if (res.length > 0) {
                    // 将历史消息拼接到现有消息的前面
                    this.activeMessages = [...res, ...this.activeMessages];
                    return res;
                }
                return [];
            } catch (error) {
                console.error('加载历史记录失败', error);
                return [];
            } finally {
                this.isLoading = false;
            }
        },

        // 重置数据
        resetData() {
            this.sessionList = [];
            this.activeMessages = [];
            this.currentSessionId = null;
            this.isLoading = false;
            this.noMore = false;
        },


    },
    getters: { 
        // 获取当前类型的消息列表
        // currentMessages: (state) => { 
        //     return state.messageList[state.currentType] || [];
        // },
    },


});