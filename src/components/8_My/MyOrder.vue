<template>
    <div class="my-order-container">
        <label class="title">订单信息</label>
        <div class="form-row">
            
        </div>
        <div class="order-list">
            <OrderItem
                v-for="order in orderStore.orderList"
                :key="order.id"
                :orderInfo="order"
            />
        </div>
    </div>
</template>

<script> 
    import { useOrderStore } from '@/stores/order';
    import OrderItem from './Common/MyOrderItem.vue';

    export default {
        name: 'MyOrder',
        components: {
            OrderItem,
        },
        setup() {
            const orderStore = useOrderStore()
            return { orderStore };
        },
        data() {
            return {
                orderList: []
            }
        },
        methods: {

        },
        mounted() {
            this.orderStore.getOrderList();
        }
    }
</script>

<style scoped>
    .my-order-container{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */

        gap: 0.5rem;
    }

    /* 标题 */
    .title {
        /* font-size: 36px; */
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #ff2e63;

    }

    .form-row {
        width: 100%;
        height: auto;
        min-height: 10rem;

        /* background-color: #6eb6ff; */

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }
</style>