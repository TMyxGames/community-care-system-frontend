import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import request from "@/utils/request";

export const useMessageStore = defineStore("message", { 
    state: () => ({ 
        sessionList: [], // 会话列表
        activeMessages: [], // 当前会话消息列表
        currentSessionId: null, // 当前会话对象
        isLoading: false,
    }),
    actions: { 
        async getSessionList() { 
            const res = await request.get('/session/all');
            if (res.data.code === 200) { 
                this.sessionList = res.data.data;
            }
        },


    },
    getters: { 
        // 获取当前类型的消息列表
        // currentMessages: (state) => { 
        //     return state.messageList[state.currentType] || [];
        // },
    },


});