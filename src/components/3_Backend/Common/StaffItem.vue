<template>
    <div class="staff-item-container">
        <div class="info-header">
            <span class="staff-name">{{ staffInfo.username }}</span>
        </div>
        <div class="info-footer">

        </div>
    </div>
</template>

<script>
    export default {
        name: 'StaffItem',
        props: {
            staffInfo: {
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
    .staff-item-container {
        width: auto;
        height: auto;
        padding: var(--thin-gap);

        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        align-items: center;

    }

    .staff-name {
        font-weight: bold;
        font-size: 1.1rem;
        margin-right: 1rem; 
    }

    .info-footer {
        margin-left: auto;
    }


</style>