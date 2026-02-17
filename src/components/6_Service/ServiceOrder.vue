<template>
    <mid-overlay>
        <glass-layer class="service-order-container" v-if="serviceInfo">
            <base-title>创建订单</base-title>

            <div class="service-order-item"> 
                <div class="img-area">
                    <img class="img" :src="$getFileUrl(serviceInfo.imgUrl)" alt="图片" />
                </div>
                <div class="info-area">
                    <label class="title">{{ serviceInfo.title }}</label>
                    <label class="type">{{ serviceInfo.type }}</label>
                    <label class="price">{{ serviceInfo.price }}</label>
                </div>
            </div>

            <div class="section">
                <p>下单地址：{{ this.orderForm.addressShot }}</p>
                <el-button 
                    class="location-btn"
                    @click="showPicker = true"
                >
                    选择地址
                </el-button>
            </div>

            <map-location-picker
                :visible="showPicker"
                @close="this.showPicker = false"
                @confirm="handleSelectLocation"
            />

            <div class="operation">
                <el-button
                    type="primary"
                    @click="submitOrder"
                >
                    确认预约
                </el-button>
            </div>
        </glass-layer>

        <glass-layer class="service-order-container" v-else>
            <base-title>加载中...</base-title>
        </glass-layer>
    </mid-overlay>
</template>

<script>
    import { useAuthStore } from '@/stores/auth';
    import { useServiceStore } from '@/stores/service';
    import { useAddressStore } from '@/stores/address';
    import MidOverlay from '../Common/MidOverlay.vue';
    import GlassLayer from '../Common/GlassLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import ServiceAddressItem from './Common/ServiceAddressItem.vue';
    import MapLocationPicker from '../Common/MapLocationPicker.vue';

    export default {
        name: 'ServiceOrder',
        components: {
            MidOverlay,
            GlassLayer,
            BaseTitle,
            ServiceAddressItem,
            MapLocationPicker,
        },
        setup() {
            const authStore = useAuthStore();
            const serviceStore = useServiceStore();
            const addressStore = useAddressStore();
            return { authStore, serviceStore, addressStore };
        },
        data() {
            return {
                serviceInfo: null,
                showPicker: false,
                orderForm: {
                    lng: null,
                    lat: null,
                    addressShot: '',
                },
            }
        },
        async mounted() {
            const serviceId = this.$route.params.id;
            
            const data = await this.serviceStore.getServiceById(serviceId);
            if (data) {
                this.serviceInfo = data;
            }

        },
        methods: {
            // 选择地址
            handleSelectLocation(data) {
                this.orderForm.lng = data.lng;
                this.orderForm.lat = data.lat;
                this.orderForm.addressShot = data.address;
                this.showPicker = false;
            },
            // 提交订单
            async submitOrder() {
                if (!this.orderForm.lng || !this.orderForm.addressShot) {
                    this.$message.error('请选择服务地址');
                    return;
                }
                
                try {
                    const orderData = {
                        // userId: this.authStore.userInfo.id,
                        serviceId: this.serviceInfo.id,
                        serviceTitle: this.serviceInfo.title,
                        serviceImg: this.serviceInfo.imgUrl,
                        servicePrice: this.serviceInfo.price,
                        lng: this.orderForm.lng,
                        lat: this.orderForm.lat,
                        addressShot: this.orderForm.addressShot,
                    };

                    const res = await this.$http.post('/order/create', orderData);
                    this.$message.success('预约成功');
                    this.$router.push('/MyOrder');
                } catch (error) {
                    console.error("订单提交失败", error);
                    this.$message.error('预约失败');
                }
                
            }
        },
    }
</script>

<style scoped>
    .service-order-container {
        width: 100%;
        height: 100rem;
        max-width: 100rem;

        display: flex;
        flex-direction: column;
        gap: clamp(1rem, 1.5vw, 1.5rem)
    }

    .service-order-item {
        width: 100%;
        height: auto;

        background-color: white;

        display: grid;
        grid-template-columns: 20rem 1fr;
        gap: 1rem;
    }

    .img-area {
        width: 20rem;
        height: 20rem;

        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1 / 1;
    }

    .img {
        width: 100%;
        height: 100%;

        object-fit: cover;
        border-radius: 1rem;

        aspect-ratio: 1 / 1;
    }

    .section {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .location-btn {
        width: 5rem;
    }

    .address {
        width: 100%;
        height: 10rem;

        display: flex;
        gap: 1rem;
    }
</style>