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
        outCount: {}, // 离开安全区域计数器
        isInAlarmStatus: {}, // 是否处于安全提醒状态（是否在安全区域外）
        currentAlarmingElderId: null, // 安全提醒弹窗对应的老人id

        showSafetyDialog: false, // 是否显示安全提醒对话框
        dialogStage: 0, // 提醒阶段

        isLoading: false,
        isStatusReady: false, // 是否已获取告警状态

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

        // 获取监控目标的位置信息以及告警状态（防止页面刷新后告警状态丢失）
        async loadMonitoringData() {
            this.isStatusReady = false;
            const authStore = useAuthStore();
            // 将地图显示模式改为security
            this.currentMode = 'security';
            // 要显示的监控目标列表
            let monitorUsers = [];
            // 如果当前用户是老人，则显示自己的位置，否则显示所有已绑定的老人的位置
            if (authStore.userInfo.role === 3) {
                monitorUsers = [{
                    id: authStore.userInfo.id,
                    username: authStore.userInfo.username,
                    realName: authStore.userInfo.realName,
                    avatarUrl: authStore.userInfo.avatarUrl,
                }];
            } else {
                try {
                    const res = await request.get('/auth/bindings');    
                    monitorUsers = res;
                } catch (error) {
                    console.log(error);
                }
            }
            this.showAllUsers(monitorUsers);
            // 遍历当前监控目标列表，获取他们的告警状态
            const statusPromises = monitorUsers.map(async (user) => {
                try {
                    const status = await request.get(`/security/alarm-status/${user.id}`);
                    console.log(`状态恢复成功：`, status);
                    if (status.isAlarming) {
                        // 如果用户处于告警状态（redis中存在告警数据）
                        this.isInAlarmStatus[user.id] = true;

                        this.dialogStage = status.stage;
                        this.currentAlarmingElderId = user.id;
                        this.showSafetyDialog = true;
                        console.log(`状态同步成功：老人 ${user.realName} (ID: ${user.id}) 处于告警阶段 ${status.stage}`);
                    } else {
                        // 如果后端没有告警记录，确保本地状态为 false
                        this.isInAlarmStatus[user.id] = false;
                    }
                    // 如果处于静默期则不告警，但也确保状态同步
                    if (status.isSilenced) {
                        console.log(`老人 ${user.realName} 当前处于静默期，剩余时间：${status.silenceMinutesLeft}分钟`);
                        this.isInAlarmStatus[user.id] = false;
                    }
                } catch (error) {
                    console.error(`同步老人 ${user.id} 状态失败:`, error);
                }
            });
            // 等待所有状态请求完成
            await Promise.all(statusPromises);
            this.isStatusReady = true;
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
            // 增加详细的路径排查
            // console.log(`[校验检查] ID:${userId}, Ready:${this.isStatusReady}, Loading:${this.isLoading}, Areas:${this.activeSafeAreas?.length}`);

            if (!this.isStatusReady) {
                console.log("状态同步中...");
                return; 
            }
            if (!this.isLoading) {
                this.refreshSafeAreas();
                return;
            }
            const safeAreas = this.activeSafeAreas;
            if (!safeAreas || safeAreas.length === 0) return;

            const isSafe = safeAreas.some(area => checkInArea(point, area));
            // console.log(`判定结果 - 是否安全: ${isSafe}, 坐标: ${JSON.stringify(point)}, 区域详情:`, safeAreas[0]);
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

        // 处理安全提醒
        async handleSafetyAlarm(userId) {
            try {
                const res = await request.post('/security/safety-alarm', { userId });
                // 如果后端因为静默返回了null，则重置触发锁定状态
                if (!res || res.stage === undefined) {
                    this.isInAlarmStatus[userId] = false; 
                    return;
                }
                if (res.stage) {
                    this.dialogStage = res.stage;
                    this.showSafetyDialog = true;
                    this.currentAlarmingElderId = userId;
                }
            } catch (error) {
                this.isInAlarmStatus[userId] = false;
                console.error('发送告警失败', error);
            }
        },

        // 当家属点击确认安全或收到ws清除指令时
        clearAlarmState() {
            this.showSafetyDialog = false;
            this.dialogStage = 0;
            this.currentAlarmingElderId = null;
        },

        // 处理安全返回邮件
        async handleBackToSafety(userId) {
            try {
                await request.post('/security/back-to-safety', { userId });
                this.isInAlarmStatus[userId] = false;
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