<template>

    <div id="map-container" class="map-container"></div>

</template>

<script setup>
    import { onMounted, onUnmounted, defineExpose, ref, watch } from "vue";
    import { useUserStore } from "@/stores/user";
    import AMapLoader from "@amap/amap-jsapi-loader";

    let map = null;
    let polygons = []; // 地图上的区域对象
    let mouseTool = null; // 鼠标工具
    let currentPolygon = null; // 当前绘制的图形
    let AMapInstance = null;
    const markerMap = new Map();
    const userStore = useUserStore();


    // 分类存储Marker的对象
    const markerMapContainer = {
        staff: new Map(),
        user: new Map(),
    };
    const getMapInstance = () => map;

    /**
     * 通用图标更新函数
     * @param {string} category - 类别: 'staff' 或 'user'
     * @param {Array} dataList - 包含 id, lng, lat 的对象数组
     * @param {Object} options - 自定义配置（图标路径等）
     */
    const updateMarkers = (type, dataList, options = {}) => { 
        if(!map || !window.AMap) return;

        const specMarkerMap = markerMapContainer[type]; // 获取对应类型的MarkerMap
        if (!specMarkerMap) return;

        const config = {
            icon: options.icon || 'https://webapi.amap.com/theme/v1.4/markers/n/mark_r.png',
            size: options.size || 32,
            ...options,
        };

        const currentIds = new Set();

        dataList.forEach(item => { 
            if (!item.lng || !item.lat) return;
            currentIds.add(item.id);

            const position = [item.lng, item.lat]; // Marker的经纬度

            if (specMarkerMap.has(item.id)) { 
                // 如果存在，则更新位置
                specMarkerMap.get(item.id).setPosition(position);
            } else { 
                // 如果不存在，则创建
                // 调用高德地图的创建Marker方法
                const marker = new window.AMap.Marker({
                    position: position,
                    map: map,
                    content: `<div class="custom-marker marker-${type}">
                                <div class="marker-label">${item.realName || item.username}</div>
                            </div>`,
                    offset: new window.AMap.Pixel(-(config.size / 2), -config.size),
                });
                specMarkerMap.set(item.id, marker);
            }
        });
        // 清除不在列表中的人员标记
        specMarkerMap.forEach((marker, id) => { 
            if (!currentIds.has(id)) { 
                marker.setMap(null);
                specMarkerMap.delete(id);
            }
        });
    };

    watch(
        () => userStore.allStaff,
        (newList) => { 
            if (newList && newList.length > 0) {
                updateMarkers('staff', newList, {
                    icon: 'https://webapi.amap.com/theme/v1.4/markers/n/mark_b.png',
                    size: 32,
                });
            }
        },
        { deep: true }
    );

    watch(
        () => userStore.userList,
        (newList) => { 
            if (newList && newList.length > 0) {
                updateMarkers('user', newList, {
                    icon: 'https://webapi.amap.com/theme/v1.4/markers/n/mark_b.png',
                    size: 36,
                });
                if (user.safeArea) {
                    user.safeArea.forEach(area => {
                        checkInArea([user.lng, user.lat], area);
                    })
                }
            }
        },
        { deep: true }
    );

    // 检测人员是否在区域内
    const checkInArea = (point, areaItem) => { 
        if (!window.AMap || !window.AMap.GeometryUtil) return;
        
        try {
            const path = JSON.parse(areaItem.scopePath);
            const polygonPath = path.map(p => [p.lng, p.lat]);

            const isIn = window.AMap.GeometryUtil.isPointInPolygon(point, polygonPath);
            if(!isIn) {
                console.warn(`用户离开了区域：${areaItem.areaName || ''}`);
            }
            return isIn;
        } catch (error) { 
            console.error("区域校验失败", error);
        }
    };

    // 绘制图形
    const drawPolygon = () => { 
        if (!mouseTool) {
            mouseTool = new AMap.MouseTool(map);
        }
        mouseTool.polygon({
            strokeColor: "#fc5c9c",
            strokeOpacity: 0.25,
            strokeWeight: 5,
            fillColor: "#fccde2",
            fillOpacity: 0.25,
        });
        mouseTool.on("draw", (e) => { 
            currentPolygon = e.obj; // 获取路径坐标数组
            mouseTool.close(false); // 关闭鼠标工具
            console.log("绘制完成");
        });
    };

    // 获取绘制的图形
    const getPath = () => { 
        if (mouseTool) {
            mouseTool.close(false);
        }
        if (currentPolygon) { 
            return currentPolygon.getPath();
        }
        return null;
    };

    // 清除当前绘制
    const clearDraw = () => { 
        if (mouseTool) {
            mouseTool.close(true); // 清除当前绘制状态
        }
        if (currentPolygon) {
            map.remove(currentPolygon); // 清除绘制完成的图形
            currentPolygon = null;
        }
    };

    // 清空地图
    const clearAll = () => { 
        clearDraw(); // 清除绘制状态
        if (map) {
            map.clearMap(); // 清空所有图形
        }
    };

    // 关闭鼠标工具（取消绘制）
    const closeTool = () => { 
        if (mouseTool) {
            mouseTool.close(true); // 清除绘制状态
        }
    };

    // 显示已有的区域
    const existingAreaDisplay = (areaList) => { 
        if (!map) return;
        polygons.forEach(p => map.remove(p));
        polygons = [];

        areaList.forEach((item) => { 
            const path = JSON.parse(item.scopePath);
            const polygon = new window.AMap.Polygon({
                path: path,
                strokeColor: "#FF33FF",
                strokeOpacity: 0.25,
                strokeWeight: 5,
                fillColor: "#1791fc",
                fillOpacity: 0.25,
                extData: item,
            });
            map.add(polygon);
            polygons.push(polygon); // 添加到数组中
        });
        map.setFitView();
    };

    // 聚焦
    const focusOnArea = (areaId) => {
        const target = polygons.find(p => p.getExtData().id === areaId);
        if (target && map) {
            map.setFitView(target, false, [60, 60, 60, 60], 18); 
        }
    };

    const focusOnStaff = (staff) => {
        if (map && staff.lng && staff.lat) {
            map.setZoomAndCenter(18, [staff.lng, staff.lat]);
        }
    };

    onMounted(() => {
        window._AMapSecurityConfig = {
            securityJsCode: "98431c9e945c81b827dbc2adfe096468",
        };
        AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d",
            version: "2.0",
            plugins: ["AMap.Scale", "AMap.MouseTool"],
        })
            .then((AMap) => {
                AMapInstance = AMap;
                map = new AMap.Map("map-container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                });

                if (userStore.allStaff.length > 0) {
                    updateMarkers('staff', userStore.allStaff, { icon:'...', size: 32 });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });

    defineExpose({
        getMapInstance,
        drawPolygon,
        getPath,
        clearAll,
        clearDraw,
        closeTool,
        existingAreaDisplay,
        focusOnArea,
        focusOnStaff,
        
    });

    onUnmounted(() => {
        // 遍历清理分类容器中的所有 Marker
        Object.values(markerMapContainer).forEach(specMap => {
            specMap.forEach(m => m.setMap(null));
            specMap.clear();
        });
        map?.destroy();
    });
</script>

<style scoped>
    .map-container { 
        padding: 0px;
        margin: 0px;
        position: relative;
        overflow: hidden;

        border-radius: 1rem;
    }

    :deep(.custom-marker) {
        position: relative;
        cursor: pointer;
    }
    :deep(.marker-label) {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 2px 8px;
        border: 1px solid #409EFF;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

</style>