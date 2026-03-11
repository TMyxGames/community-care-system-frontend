<template>
    <mid-overlay>
        <glass-layer class="service-order-container" v-if="serviceInfo">
            <base-title>创建订单</base-title>

            <card-layer class="service-order-item"> 
                <div class="img-area">
                    <img class="img" :src="$getFileUrl(serviceInfo.imgUrl)" alt="图片" />
                </div>
                <div class="detail-area">
                    <div class="info">
                        <label class="title">{{ serviceInfo.title }}</label>
                        <label class="type">{{ serviceInfo.type }}</label>
                        <label class="price">{{ serviceInfo.price }}￥</label>
                    </div>
                    <div class="control">
                        <div class="contact">
                            <el-input
                                class="phone-input"
                                v-model="orderForm.phone"
                                placeholder="请输入手机号"
                                clearable
                                maxlength="11"
                                show-word-limit
                            ></el-input>
                        </div>
                        <div class="select-location">
                            <p>下单地址：{{ this.orderForm.addressShot }}</p>
                            <el-button 
                                class="location-btn"
                                type="primary"
                                plain
                                @click="showPicker = true"
                            >
                                选择地址
                            </el-button>
                        </div>
                    </div>
                </div>
            </card-layer>

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
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import ServiceAddressItem from './Common/ServiceAddressItem.vue';
    import MapLocationPicker from '../Common/MapLocationPicker.vue';

    export default {
        name: 'ServiceOrder',
        components: {
            MidOverlay,
            GlassLayer,
            CardLayer,
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
                    phone: '',
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
                if (!this.orderForm.lng || !this.orderForm.addressShot || !this.orderForm.phone) {
                    this.$message.error('请填写完整信息');
                    return;
                }
                
                try {
                    const orderData = {
                        serviceId: this.serviceInfo.id,
                        serviceTitle: this.serviceInfo.title,
                        serviceImg: this.serviceInfo.imgUrl,
                        servicePrice: this.serviceInfo.price,
                        lng: this.orderForm.lng,
                        lat: this.orderForm.lat,
                        phone: this.orderForm.phone,
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

        display: flex;
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

    .detail-area {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .info {
        width: 100%;
        height: fit-content;

        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .title {
        height: fit-content;
    }

    .type {
        height: fit-content;
        width: fit-content;
        padding: 0 0.1rem 0 0.1rem;
        background-color: #6eb6ff;
        color: #fff;
        border-radius: 0.25rem;

        font-size: clamp(1rem, 1.25vw, 1.25rem);
        font-weight: 500;
    }

    .price {
        color: #ffc93c;
        font-size: clamp(1rem, 1.5vw, 1.5rem);
        font-weight: 700;
        line-height: clamp(1rem, 1.5vw, 1.5rem);

        position: relative;
    }

    .control {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;

        margin-top: auto;
    }

    .contact {
        width: fit-content;
        height: fit-content;

        display: flex;
        align-items: center;
        gap: 2rem;
    }


    .select-location {
        width: 100%;
        height: auto;

        display: flex;
        align-items: center;
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

    .operation {
        width: 100%;
        height: auto;

        display: flex;
        justify-content: center;
    }

    @media (max-width: 768px) { 
        .service-order-item {
            flex-direction: column;
        }
        .img-area {
            width: 100%;
            height: 100%;
        }
    }
</style>