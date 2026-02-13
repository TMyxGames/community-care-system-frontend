<template>
    <div class="location-control-container">
        <p>当前控制的用户id为：</p>
        <div class="row"><el-button icon="ArrowUp" @click="move('up')" /></div>
        <div class="row">
            <el-button icon="ArrowLeft" @click="move('left')" />
            <el-button icon="ArrowRight" @click="move('right')" />
        </div>
        <div class="row"><el-button icon="ArrowDown" @click="move('down')" /></div>

    </div>

</template>

<script setup>
    import request from '@/utils/request';
    const props = defineProps(['userId', 'type']);

    const move = async (dir) => {
        if (!props.userId) return;

        await request.post(`/location/move?userId=${props.userId}&type=${props.type}&direction=${dir}`);
    }
</script>

<style scoped>
    .location-control-container{
        width: 15rem;
        height: 15rem;
        padding: 1rem;

        box-sizing: border-box;
        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .row { 
        display: flex; 
        gap: 5px; 
    }
</style>