import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useLocationStore } from "./location";
import { ElNotification } from "element-plus";

export const useSocketStore = defineStore("socket", () => { 
    const messageSocket = ref(null); // 消息socket
    const locationSocket = ref(null); // 位置socket

    const authStore = useAuthStore();
    const locationStore = useLocationStore();
    let heartbeatTimer = null;
    const reconnectCount = ref(0);
    const maxReconnectAttempts = 5;
    // 初始化消息socket
    const initMessageSocket = () => { 
        // 如果是已连接或未登录，则不初始化连接
        if (messageSocket.value?.readyState === WebSocket.OPEN || !authStore.userInfo?.id) return;

        const ws = new WebSocket (`ws://localhost:8081/ws/message?userId=${authStore.userInfo.id}`);

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
            messageSocket.value = null;
            console.log("消息服务器连接已断开，正在尝试重连...");

            if (reconnectCount.value < maxReconnectAttempts) {
                attemptReconnect();
            }
        };

        ws.onerror = (err) => { 
            console.error("消息服务器连接出错：", err);
            ws.close();
        };

        messageSocket.value = ws;
    };  

    // 初始化位置socket
    const initLocationSocket = () => { 
        // 如果是已连接或未登录，则不初始化连接
        if (locationSocket.value?.readyState === WebSocket.OPEN || !authStore.userInfo?.id) return;

        const ws = new WebSocket (`ws://localhost:8081/ws/location?userId=${authStore.userInfo.id}`);

        ws.onopen = () => { 
            console.log("已连接到位置服务器");
        };

        ws.onmessage = (event) => { 
            const payload = JSON.parse(event.data);
            console.log("收到位置数据：", payload);

            try {
                
                if (payload.type === 'staff_update') {
                    locationStore.updateFromSocket('staff', payload.data);
                } else if (payload.type === 'user_update') {
                    locationStore.updateFromSocket('user', payload.data);
                }
            } catch (e) {
                console.error("解析位置数据失败", e);
            }
        };

        ws.onclose = () => { 
            locationSocket.value = null;
            console.log("位置服务器连接已断开");
            // if (reconnectCount.value < maxReconnectAttempts) {
            //     attemptReconnect();
            // }
        };

        locationSocket.value = ws;
    }

    // 初始化所有socket
    const initAllSocket = () => { 
        initMessageSocket();
        initLocationSocket();
    };

    // 关闭所有socket
    const closeAllSocket = () => { 
        messageSocket.value?.close();
        locationSocket.value?.close();
        messageSocket.value = null;
        locationSocket.value = null;
    };






    // 尝试重连
    const attemptReconnect = () => { 
        reconnectCount.value++;
        const delay = Math.min(1000 * Math.pow(2, reconnectCount.value), 10000); // 指数增长延迟，最高10秒

        console.log(`第 ${reconnectCount.value} 次重连将在 ${delay/1000} 秒后开始...`);
        setTimeout(() => { 
            initMessageSocket();
            initLocationSocket();
        }, delay);
    };

    // 处理接收到的消息
    const handleIncomingMessage = (msg) => { 
        console.log("收到消息：", msg);
        ElNotification({
            title: "绑定请求更新",
            message: msg.content || "您有一条新的绑定请求消息",
            type: msg.status === 2 ? "warning" : "info",
            position: 'bottom-right',
            duration: 3000,
        });
        window.dispatchEvent(new CustomEvent("new-message", { detail: msg }));
    };

    return { 
        messageSocket,
        locationSocket,
        initAllSocket,
        closeAllSocket,
    };

});