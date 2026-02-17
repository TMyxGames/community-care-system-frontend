<template>
    <div class="order-item-container">
        <div class="info-header">
            <span class="order-sn">订单号：{{ orderInfo.orderSn }}</span>
            <span class="create-time">{{ formatTime(orderInfo.createTime) }}</span>
            <el-tag :type="statusTag" size="small">{{ statusText }}</el-tag>
        </div>
        <div class="info-content">
            <img :src="$getFileUrl(orderInfo.serviceImg)" class="service-img" alt="服务图片">
            <div class="info-detail">
                <div class="title">{{ orderInfo.serviceTitle }}</div>
                <div class="address">地址：{{ formatArea(orderInfo.addressShot) }}</div>
            </div>
            <div class="action">
                <el-button
                    v-if="orderInfo.state === 1"
                    type="primary"
                    size="small"
                    plain
                    @click="changeOrderState"
                >开始服务</el-button>
                <el-button
                    v-if="orderInfo.state === 2"
                    type="primary"
                    size="small"
                    @click="changeOrderState"
                >完成服务</el-button>
            </div>
        </div>
    </div>
</template>

<script> 
    export default {
        name: 'StaffOrderItem',
        props: {
            orderInfo: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {

            }
        },
        computed: {
            statusText() {
                const statusMap = {0: '待接单', 1: '待服务', 2: '进行中', 3: '已完成', 4: '已评价', 5: '已取消'};
                return statusMap[this.orderInfo.status] || '状态未知';
            },
            statusTag() {
                const tagMap = { 0: 'primary', 1: 'primary', 2: 'primary', 3: 'success', 4: 'success', 5: 'info' };
                return tagMap[this.orderInfo.state] || '';
            }
        },
        methods: {
            // 改变订单状态
            async changeOrderState() {
                try {
                    const res = await this.$http.put('/order/updateState', null, { 
                        params: {
                            orderId: this.orderInfo.id
                        }
                    });
                    this.$message.success('操作成功');

                } catch (error) {
                    this.$message.error('操作失败');
                }
                
            },


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
        width: auto;
        height: 10rem;
        padding: var(--thin-gap);
        /* box-sizing: border-box; */

        background-color: #cadefc;
        border-radius: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);

    }

    .service-img {
        width: 7rem;
        height: 7rem;
        object-fit: cover;
        border-radius: 1rem;
    }

    .info-header {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-content {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-detail {
        max-width: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .action {
        display: flex;
        align-items: center;

        margin-left: auto;
    }
</style>