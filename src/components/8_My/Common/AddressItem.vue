<template>
    <div class="address-item-container">
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
                v-if="addressInfo.isDefault !== 1" 
                type="text" 
                size="small" 
                @click="$emit('set-default', addressInfo.id)"
            >设为默认</el-button>
            <el-button
                type="text"
                size="small"
                @click="$emit('delete', addressInfo.id)"
            >删除</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AddressItem',
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
    .address-item-container {
        width: 100%;
        height: 10rem;

        background-color: #cadefc;

        display: flex;
        flex-direction: column;

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