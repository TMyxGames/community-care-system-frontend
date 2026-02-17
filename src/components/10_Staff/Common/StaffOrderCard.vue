<template>
    <card-layer class="staff-order-card thin">
        <el-tabs v-model="activeName" class="order-tabs">
            <el-tab-pane label="待服务订单" name="first">
                <staff-order-item
                    v-for="order in orderStore.orderList"
                    :key="order.id"
                    :order-info="order"
                />
            </el-tab-pane>
            <el-tab-pane label="进行中订单" name="second">
                <staff-order-item
                    v-for="order in orderStore.orderList"
                    :key="order.id"
                    :order-info="order"
                />
            </el-tab-pane>
            <el-tab-pane label="历史订单" name="third">
                <staff-order-item
                    v-for="order in orderStore.orderList"
                    :key="order.id"
                    :order-info="order"
                />
            </el-tab-pane>
        </el-tabs>
    </card-layer>
</template>

<script setup> 
    import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
    import { useOrderStore } from '@/stores/order';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import StaffOrderItem from '@/components/10_Staff/Common/StaffOrderItem.vue';

    const orderStore = useOrderStore();

    const activeName = ref('first');

    watch(activeName, (newName) => {
        loadDataByTab(newName)
    });

    const loadDataByTab = (tabName) => { 
        switch (tabName) {
            case 'first':
                orderStore.getPendingOrder();
                break;
            case 'second':
                orderStore.getDoingOrder();
                break;
            case 'third':
                orderStore.getHistoryOrder();
                break;
        }
    }
    const handleNewOrder = (event) => { 
        if (activeName.value === 'first') {
            orderStore.getPendingOrder();
        }
        console.log('收到新订单:', event.detail);
    };

    onMounted(() => { 
        loadDataByTab(activeName.value);
        window.addEventListener('new-order', handleNewOrder);
    });

    onUnmounted(() => {
        window.removeEventListener('new-order', handleNewOrder);
    });
</script>

<style scoped>
    .staff-order-card {
        width: 100%;
        height: 100%;
    }

    .order-tabs {
        width: 100%;
        height: 100%;
    }

    @media (max-width: 768px) { 

    }
</style>