<template>
    <div class="search-user-item-container">
        <div class="info-area">
            <div class="info-row">
                <span class="user-username">@{{ userInfo.username }}</span>
                <span class="user-real-name">{{ userInfo.realName }}</span>
                <span class="user-id">( id:{{ userInfo.id }} )</span>
            </div>
        </div>

        <div class="operation-area">
            <el-button
                class="operation-btn"
                type="text"
                size="small"
                @click.stop="$emit('send', userInfo)"
            >发送请求</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SearchUserItem',
        props: {
            userInfo: {
                type: Object,
                required: true,
            }
        },
        setup() {

        },
        computed: {

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
    .search-user-item-container {
        width: auto;
        height: auto;
        /* max-width: 15rem; */
        padding: 1rem;

        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .info-area {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.25rem;
    }

    .info-row {
        width: auto;
        max-width: 15rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .user-username {
        font-weight: 700;
        font-size: 1rem;
    }

    .user-real-name {
        font-weight: 500;
        font-size: 0.8rem;
    }

    .operation-area {
        margin-left: auto;
    }

</style>