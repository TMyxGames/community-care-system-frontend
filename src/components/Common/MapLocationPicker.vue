<template>
    <Teleport to="body">

        <div class="full-screen-picker" v-if="visible">

            <div class="header">
                <el-input id="search-input" class="search-input" v-model="searchText" placeholder="搜索地址"/>
                <el-button @click="close">取消</el-button>
            </div>

            <div id="map-location-picker" class="map-location-picker"></div>

            <div class="center-cross">📍</div>

            <div class="footer">
                <p class="address-text">{{ currentAddress }}</p>
                <el-button type="primary" :disabled="!coords.lng" @click="confirm">确定</el-button>
            </div>

        </div>

    </Teleport>        
</template>

<script setup>
    import { onMounted, onUnmounted, ref, nextTick, watch } from "vue";
    import AMapLoader from "@amap/amap-jsapi-loader";

    let map = null;

    const props = defineProps(['visible']);
    const emit = defineEmits(['close', 'confirm']);

    const searchText = ref('');
    const currentAddress = ref('正在获取位置...');
    const coords = ref({ lng: null, lat: null });

    const initMap = async () => {
        await nextTick();

        if (map) {
            map.destroy();
        };

        window._AMapSecurityConfig = {
            securityJsCode: "98431c9e945c81b827dbc2adfe096468",
        };

        AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d",
            version: "2.0",
            plugins: ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Geocoder"],
        })
            .then((AMap) => {
                map = new AMap.Map("map-location-picker", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 16, // 初始化地图级别
                });

                const auto = new AMap.AutoComplete({ input: "search-input" });
                const geocoder = new AMap.Geocoder();
                // 搜索结果点击
                auto.on('select', (e) => {
                    const { location, name, address } = e.poi;
                    map.setCenter(location);
                    updateLocation(location.lng, location.lat, name + address);
                });
                // 点击地图上的任意位置选点
                map.on('click', (e) => {
                    // 点击位置的经纬度
                    const { lng, lat } = e.lnglat;
                    map.panTo([lng, lat]);
                    currentAddress.value = "正在获取位置...";
                    geocoder.getAddress([lng, lat], (status, result) => {
                        if (status === 'complete' && result.regeocode) {
                            const addr = result.regeocode;
                            const component = addr.addressComponent;
                            const city = component.city || component.province;

                            const fullAddress = (component.city || '') + 
                                                component.district + 
                                                component.township + 
                                                (component.streetNumber || component.street || '');

                            const poiName = (addr.pois && addr.pois.length > 0) ? addr.pois[0].name : '';
        
                            const finalAddress = poiName ? (fullAddress + poiName) : addr.formattedAddress;

                            updateLocation(lng, lat, finalAddress);
                        } else {
                            currentAddress.value = "获取位置失败，请重试";
                        }
                    });
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    onMounted(() => {
        if (props.visible) {
            initMap();
        }
    });

    onUnmounted(() => {
        map?.destroy();
    });

    const updateLocation = (lng, lat, address) => {
        coords.value = { lng, lat };
        currentAddress.value = address;
    };

    const confirm = () => {
        emit('confirm', { ...coords.value, address: currentAddress.value });
        close();
    };

    const close = () => emit('close');

    watch(() => props.visible, (val) => {
        if (val) {
            initMap()
        };
    });



</script>

<style scoped>
    .full-screen-picker {
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        background-color: white;

        position: fixed;
        z-index: 9999;
    }

    .map-location-picker { 
        width: 100%;
        height: 100%;
    }

    .header {
        width: 100%;
        height: auto;
        top: 2.5rem;
        left: 2.5rem;
        max-width: 20rem;

        position: absolute;
        z-index: 10;
    }

    .search-input { 
        width: 100%;
    }

    .center-cross { 
        top: 50%;
        left: 50%;
        transform: translate(-50%, -100%);

        font-size: 30px;
        pointer-events: none;

        position: absolute;
        z-index: 5;
    }

    .footer {
        width: 100%;
        height: auto;
        bottom: 2.5rem;
        left: 2.5rem;
        max-width: 20rem;
        

        position: absolute;
        z-index: 10;
    }

    @media (max-width: 768px) { 
        .header {
            top: 0.25rem;
            left: 0.25rem;
        }
    }
</style>