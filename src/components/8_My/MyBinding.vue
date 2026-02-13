<template>
    <div class="my-binding-container">
        <base-title>绑定管理</base-title>
    
        <div class="binding-list">
            <my-binding-item 
                v-for="item in bindingList"
                :key="item.id"
                :item="item"
                @refresh="loadBindings"
            />
        </div>
    </div>
</template>

<script setup>
    import BaseTitle from '../Common/BaseTitle.vue';
    import MyBindingItem from './Common/MyBindingItem.vue';
    import { useAuthStore } from '@/stores/auth';
    import { ref, onMounted, onUnmounted } from 'vue';
    import request from '@/utils/request';

    const authStore = useAuthStore();
    const bindingList = ref([]);

    // 获取当前用户的绑定列表
    const loadBindings = async () => {
        try {
            const res = await request.get('/auth/bindings', {
                params: {
                    userId: authStore.userInfo.id,
                }
            });

            bindingList.value = res;

        } catch (error) {
            console.log('加载绑定列表失败：', error);

        }
    }


    const handleMessageEvent = (event) => { 
        const msg = event.detail;
        if (msg.type == 1) {
            if (msg.status == 1 || msg.status == 3) {
                loadBindings();
            }
        }
        
    }   

    onMounted(() => {
        loadBindings();
        window.addEventListener('new-message', handleMessageEvent);
    })

    onUnmounted(() => { 
        window.removeEventListener('new-message', handleMessageEvent);
    })


</script>

<style scoped>
    .my-binding-container{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */

        gap: 1rem;
    }

    .binding-list{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        gap: 1rem;
    }
</style>