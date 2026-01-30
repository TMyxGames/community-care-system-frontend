<template>
    <div class="area-item-container">
        <div class="info-header">
            <span class="area-name">{{ areaInfo.areaName }}</span>
        </div>
        <div class="info-footer">
            <el-button
                class="delete-btn"
                type="text"
                size="small"
                @click.stop="$emit('delete', areaInfo.id)"
            >删除</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ServiceAreaItem',
        props: {
            areaInfo: {
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
    .area-item-container {
        width: auto;
        height: auto;
        padding: var(--thin-gap);

        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        align-items: center;

    }

    .area-name {
        font-weight: bold;
        font-size: 1.1rem;
        margin-right: 1rem; 
    }

    .info-footer {
        margin-left: auto;
    }


</style>