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
            try { 
                const data = await request.get(`/message/list/${sessionId}`);
                this.activeMessages = data.reverse();
            } catch (error) { 
                console.error('获取消息失败：', error);
            } finally { 
                this.isLoading = false;
            }
        },

        // 重置数据
        resetData() {
            this.sessionList = [];
            this.activeMessages = [];
            this.currentSessionId = null;
            this.loading = false;
        },


    },
    getters: { 
        // 获取当前类型的消息列表
        // currentMessages: (state) => { 
        //     return state.messageList[state.currentType] || [];
        // },
    },


});