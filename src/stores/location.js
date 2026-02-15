import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useAreaStore } from '@/stores/area';
import { checkInArea } from '@/utils/mapUtil';
import request from '@/utils/request';

export const useLocationStore = defineStore('location', {
    state: () => ({
        allLocations: {
            user: {},
            staff: {},
        },
        activeMarkers: [], // 地图上显示的marker列表
        focusId: null, // 当前聚焦的marker
        currentMode: 'staff', // 地图显示模式

        activeSafeAreas: [], // 安全区域缓存
        alarmCooldowns: {}, // 邮件提醒冷却
        outCount: {}, // 离开安全区域计数器
        isInAlarmStatus: {}, // 是否处于安全提醒状态（是否在安全区域外）

        isLoading: false,

    }),
    actions: {
        // 处理ws推送的数据
        updateFromSocket(type, socketData) {
            if (!this.allLocations[type]) return;

            Object.assign(this.allLocations[type], socketData);

            const isMatching = (type === 'staff' && this.currentMode === 'staff')
                            || (type === 'user' && this.currentMode === 'security');

            if (isMatching) {
                this.activeMarkers = this.activeMarkers.map(marker => {
                    const newData = socketData[marker.id];
                    if (newData) {
                        return {
                            ...marker,
                            lng: newData.lng,
                            lat: newData.lat,
                        }
                    }
                    return marker;
                });
            }
            // 如果是老人位置更新，并且处于安全监控模式
            if (type === 'user' && this.currentMode === 'security') {
                this.activeMarkers.forEach(user => {
                    const newData = socketData[user.id];
                    if (newData) {
                        // 执行安全校验
                        this.validateUserSafety(user.id, [newData.lng, newData.lat]);
                    }
                });
            }
        },

        // 获取监控目标的位置信息
        async loadMonitoringData() {
            const authStore = useAuthStore();
            // 将地图显示模式改为security
            this.currentMode = 'security';

            if (authStore.userInfo.role === 3) {
                const user = [{
                    id: authStore.userInfo.id,
                    username: authStore.userInfo.username,
                    realName: authStore.userInfo.realName,
                    avatarUrl: authStore.userInfo.avatarUrl,
                }];
                this.showAllUsers(user);
            } else {
                try {
                    const res = await request.get('/auth/bindings');    
                    this.showAllUsers(res);
                } catch (error) {
                    console.log(error);
                }
            }
        
        },

        // 刷新安全区域缓存
        async refreshSafeAreas() {
            try {
                // 只在必要时调用接口
                const res = await request.get('/area/safe/all');
                this.activeSafeAreas = res || [];
                console.log('校验区域已更新', this.activeSafeAreas);
                this.isLoading = true;
            } catch (error) {
                console.error('获取校验区域失败', error);
            }
        },

        // 安全校验总控
        validateUserSafety(userId, point) {
            if (!this.isLoading) {
                this.refreshSafeAreas();
                return;
            }
            const safeAreas = this.activeSafeAreas;
            if (!safeAreas || safeAreas.length === 0) return;

            const isSafe = safeAreas.some(area => checkInArea(point, area));

            if (!isSafe) {
                // 离开安全区域计数器+1，计数超过6次则发送邮件提醒 (5s * 6 = 30s)
                this.outCount[userId] = (this.outCount[userId] || 0) + 1;
                if (this.outCount[userId] >= 6) {
                    console.log(`注意：用户 ${userId} 已离开安全区域！`);
                    this.handleSafetyAlarm(userId);
                    this.isInAlarmStatus[userId] = true;
                    this.outCount[userId] = 0;
                }
            } else { 
                if (this.isInAlarmStatus[userId]) {
                    console.log(`用户 ${userId} 已回到安全区域`);
                    this.handleBackToSafety(userId);
                    this.isInAlarmStatus[userId] = false;
                }
                this.outCount[userId] = 0;
            }
        },

        // 处理安全提醒邮件
        async handleSafetyAlarm(userId) {
            const now = Date.now();
            const lastAlarmTime = this.alarmCooldowns[userId] || 0;
            const cooldownPeriod = 5 * 60 * 1000; // 5分钟
            // 检查本地冷却
            if (now - lastAlarmTime < cooldownPeriod) {
                // 发送邮件提醒
                console.log(`用户 ${userId} 处于告警冷却期，跳过请求`);
                return;
            }

            try {
                console.warn(`用户 ${userId} 已离开安全区域，尝试发送邮件告警...`);
                const res = await request.post('/message/safety-alarm', { userId });

                if (res.msg && res.msg.includes("冷却")) {
                    console.log(`用户 ${userId} 仍处于告警冷却期，跳过请求`);
                    this.alarmCooldowns[userId] = now;
                } else {
                    console.log("告警发送成功！");
                    this.alarmCooldowns[userId] = now;
                }

            } catch (error) {
                console.error('发送告警失败', error);
                delete this.alarmCooldowns[userId];
            }
        },

        // 处理安全返回邮件
        async handleBackToSafety(userId) {
            try {
                await request.post('/message/back-to-safety', { userId });
                // 回到区域后，清除本地冷却时间
                delete this.alarmCooldowns[userId];
            } catch (error) {
                console.error('返回提醒发送失败', error);
            }
        },

        // 显示和聚焦服务人员
        focusStaff(staffId, staffInfo) {
            this.currentMode = 'staff';
            this.focusId = staffId;
            const location = this.allLocations.staff[staffId] || {};

            this.activeMarkers = [{
                ...staffInfo,
                id: staffId,
                lng: location.lng || staffInfo.lng,
                lat: location.lat || staffInfo.lat,
                avatarUrl: staffInfo.avatarUrl,
            }];
        },

        // 全量显示
        showAllUsers(userList) {
            this.currentMode = 'security';
            this.activeMarkers = userList.map(user => {
                const location = this.allLocations.user[user.id] || {};
                return {
                    ...user,
                    id: user.id,
                    lng: location.lng || user.lng,
                    lat: location.lat || user.lat,
                    avatarUrl: user.avatarUrl,
                }
            })
        },

        clear() {
            this.activeList = [];
            this.focusId = null;
        },

    }

});