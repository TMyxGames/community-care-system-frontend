import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { useOrderStore } from "./order";
import { useLocationStore } from "./location";
import { ElNotification } from "element-plus";

export const useSocketStore = defineStore("socket", () => { 
    const messageSocket = ref(null); // 消息socket
    const locationSocket = ref(null); // 位置socket

    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    const locationStore = useLocationStore();
    let heartbeatTimer = null;
    const reconnectCount = ref(0); // 重连次数
    const maxReconnectAttempts = 5; // 最大重连次数

    const isConnected = ref(false);
    // 初始化消息socket
    const initMessageSocket = () => { 
        // 如果是已连接或未登录，则不初始化连接
        if (messageSocket.value?.readyState === WebSocket.OPEN || !authStore.userInfo?.id) return;

        // 根据当前页面协议自动切换 ws 或 wss
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // 获取当前前端页面的主机和端口
        const host = window.location.host;
        // 拼接 url
        const wsUrl = `${protocol}//${host}/ws/message?userId=${authStore.userInfo.id}`;
        console.log("正在通过代理连接消息服务器:", wsUrl);
        const ws = new WebSocket(wsUrl);
        // const ws = new WebSocket (`ws://localhost:8081/ws/message?userId=${authStore.userInfo.id}`);

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

        // 根据当前页面协议自动切换 ws 或 wss
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // 获取当前前端页面的主机和端口
        const host = window.location.host;
        // 拼接 url
        const wsUrl = `${protocol}//${host}/ws/location?userId=${authStore.userInfo.id}`;
        console.log("正在通过代理连接位置服务器:", wsUrl);
        const ws = new WebSocket(wsUrl); 
        // const ws = new WebSocket (`ws://localhost:8081/ws/location?userId=${authStore.userInfo.id}`);

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
        isConnected.value = true;
    };

    // 关闭所有socket
    const closeAllSocket = () => { 
        messageSocket.value?.close();
        locationSocket.value?.close();
        messageSocket.value = null;
        locationSocket.value = null;
        isConnected.value = false;
    };

    const closeMessageSocket = () => { 
        messageSocket.value?.close();
        messageSocket.value = null;
    };

    const closeLocationSocket = () => { 
        locationSocket.value?.close();
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
        const { type, data } = msg;

        switch (type) { 
            case "bind_request":
                ElNotification({
                    title: "绑定请求更新",
                    message: data.content || "您有一条新的绑定请求消息",
                    type: data.status === 2 ? "warning" : "info",
                    position: 'bottom-right',
                    duration: 5000,
                });
                window.dispatchEvent(new CustomEvent("new-message", { detail: data }));
                break;
            case "new_order":
                ElNotification({
                    title: "新订单消息",
                    message: "您收到了新订单，请及时处理",
                    type: "success",
                    position: 'bottom-right',
                    duration: 5000,
                });
                window.dispatchEvent(new CustomEvent("new-order", { detail: data }));
                break;
            case "safety_alarm":
                // 更新状态，触发全局dialog弹出
                locationStore.dialogStage = data.stage;
                locationStore.currentAlarmingElderId = data.elderId;
                locationStore.showSafetyDialog = true;
                console.log("告警的老人id为:", data.elderId);
                break;
            case "clear_alarm":
                const { action, elderId, minutes } = data;
                // 统一重置状态 (关闭弹窗和遮罩)
                locationStore.showSafetyDialog = false;
                locationStore.dialogStage = 0;
                locationStore.currentAlarmingElderId = null;
                // if (locationStore.isInAlarmStatus) {
                //     locationStore.isInAlarmStatus[elderId] = false;
                // }
                // 根据类型显示不同的UI
                if (action === "leave") {
                    ElNotification({
                        title: "告警解除",
                        message: `家属已确认老人安全，并设置了 ${minutes} 分钟的静默期。`,
                        type: "success",
                        position: 'bottom-right'
                    });
                } else if (action === "hangup") {
                    ElMessage({
                        message: '紧急通话已正常挂断',
                        type: 'info'
                    });
                }
                console.log(`[状态重置] 动作类型: ${action}, 老人ID: ${elderId}`);
                break;
            default:
                console.warn("未知的消息类型：", type);
        }
    };

    // 向后端发送位置信息
    const sendLocation = (lng, lat) => { 
        if (locationSocket.value?.readyState === WebSocket.OPEN) {
            const payload = { 
                type: 'report_location',
                lng: lng,
                lat: lat,
                userId: authStore.userInfo.id,
                avatarUrl: authStore.userInfo.avatarUrl,
                timestamp: Date.now(),
            };
            locationSocket.value.send(JSON.stringify(payload));
        } else { 
            console.error("位置服务器未连接，无法发送位置数据");
        }
    };

    return { 
        initMessageSocket,
        initLocationSocket,
        closeMessageSocket,
        closeLocationSocket,
        initAllSocket,
        closeAllSocket,
        sendLocation,
    };

});