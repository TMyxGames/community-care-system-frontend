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
                <span class="price">{{ orderInfo.servicePrice }}</span>
            </div>
            <div class="action">
                <el-button
                    v-if="orderInfo.state === 1"
                    type="danger"
                    size="small"
                    plain
                >取消订单</el-button>
                <el-button
                    v-if="orderInfo.state === 3"
                    type="primary"
                    size="small"
                    @click="handleCommit"
                >评价</el-button>
            </div>
        </div>

        <el-dialog append-to-body v-model="dialogVisible">
            <div class="form-row">
                <label>服务评价</label>
                <el-rate v-model="commentForm.serviceRate" 
                    clearable
                />
            </div>
            <div class="form-row">
                <label>服务人员评价</label>
                <el-rate v-model="commentForm.staffRate"
                    clearable
                />
            </div>
            <div class="form-row">
                <label>评论</label>
                <el-input v-model="commentForm.content"/>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="commit">提交</el-button>
                </span>
            </template>
        </el-dialog>
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
        data() {
            return {
                dialogVisible: false,
                commentForm: {
                    orderId: "",
                    serviceId: "",
                    staffId: "",
                    content: "",
                    serviceRate: null,
                    staffRate: null,
                },
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
            formatTime(timeStr) {
                if(!timeStr) return '';
                return timeStr.replace('T', ' ').substring(0, 16);
            },
            formatArea(area) {
                if(!area) return '';
                return area.replace(/\//g, '');
            },
            handleCommit() {
                this.commentForm.orderId = this.orderInfo.id;
                this.commentForm.serviceId = this.orderInfo.serviceId;
                this.commentForm.staffId = this.orderInfo.staffId;
                this.dialogVisible = true;
            },
            async commit() {
                if(!this.commentForm.serviceRate || !this.commentForm.staffRate) {
                    return this.$message.warning('请为服务评分');
                }
                if(!this.commentForm.content) {
                    return this.$message.error('请填写评价内容');
                }

                try {
                    const res = await this.$http.post('/comment/add', this.commentForm);
                    this.$message.success('评价成功');
                    this.dialogVisible = false;
                    this.$emit('refresh');
                    this.resetForm();
                } catch (error) {
                    this.$message.error('评价失败');
                }
            },
            resetForm() {
                this.commentForm = {
                    orderId: "",
                    serviceId: "",
                    staffId: "",
                    content: "",
                    serviceRate: null,
                    staffRate: null,
                }
            }

        },
    }
</script>

<style scoped>
    .order-item-container {
        width: 100%;
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