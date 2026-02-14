import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
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