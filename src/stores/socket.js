import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { ElNotification } from "element-plus";

export const useSocketStore = defineStore("socket", () => { 
    const socket = ref(null);
    const authStore = useAuthStore();
    let heartbeatTimer = null;
    const reconnectCount = ref(0);
    const maxReconnectAttempts = 5;

    // 初始化连接
    const initSocket = () => { 
        // 如果是已连接或未登录，则不初始化连接
        if (socket.value?.readyState === WebSocket.OPEN || !authStore.userInfo.id) return;

        const wsUrl = `ws://localhost:8081/ws/message?userId=${authStore.userInfo.id}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => { 
            console.log("已连接到消息服务器");
            reconnectCount.value = 0;

            heartbeatTimer = setInterval(() => { 
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send("ping");
                }
            }, 30000);
        };

        ws.onmessage = (event) => { 
            const data = JSON.parse(event.data);
            handleIncomingMessage(data);
        };

        ws.onclose = () => { 
            if (heartbeatTimer) {
                clearInterval(heartbeatTimer);
            }
            socket.value = null;
            console.log("消息服务器连接已断开，正在尝试重连...");

            if (reconnectCount.value < maxReconnectAttempts) {
                attemptReconnect();
            }
        };

        ws.onerror = (err) => { 
            console.error("消息服务器连接出错：", err);
            ws.close();
        };

        socket.value = ws;
    };  

    // 尝试重连
    const attemptReconnect = () => { 
        reconnectCount.value++;
        const delay = Math.min(1000 * Math.pow(2, reconnectCount.value), 10000); // 指数增长延迟，最高10秒

        console.log(`第 ${reconnectCount.value} 次重连将在 ${delay/1000} 秒后开始...`);
        setTimeout(() => { 
            initSocket();
        }, delay);
    };

    // 关闭连接
    const closeSocket = () => { 
        if (socket.value) {
            socket.value.close();
            socket.value = null;
            console.log("消息服务器连接已关闭");
        }
    };

    // 处理接收到的消息
    const handleIncomingMessage = (msg) => { 
        console.log("收到消息：", msg);
        ElNotification({
            title: "绑定请求更新",
            message: msg.content || "您有一条新的绑定状态变动",
            type: msg.status === 2 ? "warning" : "info",
            position: 'bottom-right',
            duration: 3000,
        });
        window.dispatchEvent(new CustomEvent("new-message", { detail: msg }));
    };

    return { 
        socket,
        initSocket,
        closeSocket,
    };

});