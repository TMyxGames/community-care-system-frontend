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
                <div class="address" v-if="selectedAddress">
                    <label>收货地址</label>
                    <label>{{ selectedAddress.contact }} {{ selectedAddress.phone }}</label>
                    <label>{{ selectedAddress.area }}{{ selectedAddress.detail }}</label>
                    <el-button
                        type="primary"
                        @click="addressDialogVisible = true"
                    >
                        修改地址
                    </el-button>
                </div>
                <div v-else>
                    <label>地址加载中</label>
                </div>

                <el-dialog 
                    v-model="addressDialogVisible"
                    title="选择地址"
                    width="40rem"
                    :append-to-body="true"
                >
                    <service-address-item
                        v-for="item in addressStore.addressList"
                        :key="item.id"
                        :addressInfo="item"
                        @select="handleSelectAddress"
                    />

                </el-dialog>
            </div>

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

    export default {
        name: 'ServiceOrder',
        components: {
            MidOverlay,
            GlassLayer,
            BaseTitle,
            ServiceAddressItem,
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
                selectedAddress: null,
                addressDialogVisible: false,
                orderForm: {
                    addressId: '',
                    time: '',
                },
            }
        },
        async mounted() {
            const serviceId = this.$route.params.id;
            
            const data = await this.serviceStore.getServiceById(serviceId);
            if (data) {
                this.serviceInfo = data;
            }

            await this.addressStore.getAddressList();
            this.defaultAddress();
        },
        methods: {
            // 默认选中地址
            defaultAddress() {
                if (this.addressStore.addressList.length > 0) {
                    const defaultAddress = this.addressStore.addressList.find(item => item.isDefault === 1) 
                                        || this.addressStore.addressList[0];
                    this.handleSelectAddress(defaultAddress);
                }
            },
            // 选择地址
            handleSelectAddress(addr) {
                this.selectedAddress = addr;
                this.orderForm.addressId = addr.id;
                this.addressDialogVisible = false;
            },
            // 提交订单
            async submitOrder() {
                if (!this.selectedAddress) {
                    this.$message.error('请选择服务地址');
                }
                // if (!this.orderForm.time) {
                //     this.$message.error('请选择预约时间');
                //     return;
                // }
                try {
                    const cleanArea = this.selectedAddress.area.replace(/\//g, '');
                    const fullAddress = this.selectedAddress.contact + " " +
                                        this.selectedAddress.phone + " " +
                                        cleanArea + 
                                        this.selectedAddress.detail;
                    const orderData = {
                        userId: this.authStore.userInfo.id,
                        serviceId: this.serviceInfo.id,
                        serviceTitle: this.serviceInfo.title,
                        serviceImg: this.serviceInfo.imgUrl,
                        servicePrice: this.serviceInfo.price,
                        addressId: this.selectedAddress.id,
                        addressShot: fullAddress,
                    };

                    const res = await this.$http.post('/order/create', orderData);
                    if (res.code === 200) {
                        this.$message.success('预约成功');
                        this.$router.push('/MyOrder');
                    }
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

    .address {
        width: 100%;
        height: 10rem;

        display: flex;
        gap: 1rem;
    }
</style>