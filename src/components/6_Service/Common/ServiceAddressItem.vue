<template>
    <div class="service-address-item" @click="$emit('select', addressInfo)">
        <div class="info-header">
            <span class="contact">{{ addressInfo.contact }}</span>
            <span class="phone">{{ addressInfo.phone }}</span>
            <span class="default" v-if="addressInfo.isDefault === 1">默认地址</span>
        </div>
        <div class="info-content">
            <span class="contact">{{ addressInfo.area }}</span>
            <span class="phone">{{ addressInfo.detail }}</span>
        </div>
        <div class="info-footer">
            <el-button 
                type="text" 
                size="small" 
            >选择该地址</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ServiceAddressItem',
        props: {
            addressInfo: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {

            }
        },
        methods: {

        },
    }
</script>

<style scoped>
    .service-address-item {
        width: 100%;
        height: 10rem;

        background-color: #cadefc;

        display: flex;
        flex-direction: column;

        cursor: pointer

    }

    .service-address-item:hover {
        transform: scale(1.05);
    }

    .contact {
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
    }
</style>