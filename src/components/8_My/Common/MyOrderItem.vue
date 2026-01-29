<template>
    <div class="order-item-container">
        <div class="info-header">
            <span class="order-sn">订单号：{{ orderInfo.orderSn }}</span>
            <span class="create-time">{{ formatTime(orderInfo.createTime) }}</span>
            <el-tag :type="statusTag" size="small">{{ statusText }}</el-tag>
        </div>
        <div class="info-content">
            <img :src="orderInfo.serviceImg" class="service-img" alt="服务图片">
            <div class="info-detail">
                <div class="title">{{ orderInfo.serviceTitle }}</div>
                <div class="address">地址：{{ formatArea(orderInfo.addressShot) }}</div>
                <span class="price">{{ orderInfo.servicePrice }}</span>
            </div>
        </div>
        <div class="info-footer">
            <el-button
                v-if="orderInfo.state === 1"
                type="danger"
                size="small"
                plain
            >取消订单</el-button>
            <el-button
                v-if="orderInfo.state === 2"
                type="primary"
                size="small"
            >评价</el-button>
        </div>
    </div>
</template>

<script> 
    export default {
        name: 'MyOrderItem',
        props: {
            orderInfo: {
                type: Object,
                required: true,
            }
        },
        computed: {
            statusText() {
                const statusMap = {0: '待付款', 1: '待服务', 2: '已完成', 3: '已取消'};
                return statusMap[this.orderInfo.status] || '状态未知';
            },
            statusTag() {
                const tagMap = { 0: 'warning', 1: 'primary', 2: 'success', 3: 'info' };
                return tagMap[this.orderInfo.state] || '';
            }
        },
        methods: {
            formatTime(timeStr) {
                if(!timeStr) return '';
                return timeStr.replace('T', ' ').substring(0, 16);
            },
            formatArea(area) {
                if(!area) return '';
                return area.replace(/\//g, '');
            },
        },
    }
</script>

<style scoped>
    .order-item-container {
        width: 100%;
        height: 10rem;

        background-color: #cadefc;

        display: flex;
        flex-direction: column;

    }

    /* .contact {
        font-weight: bold;
        font-size: 1.1rem;
        margin-right: 1rem; 
    
    }

    .phone {
        color: #666;
    }

    .detail {
        margin-left: 0.5rem;
        color: #333;
    } */
</style>