<template>
    <div id="container">
        <img :src="currentImg" alt="背景图片">
        <!-- <div class="overlay"></div> -->
    </div>

</template>

<script>
    export default {
        name: 'GlobalBackground',
        props: {
            imgSrc: {
                type: String,
                default: '',
            },
            autoTimeChange: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                timeMaps: {
                    time1: require('@/assets/backgrounds/日出.png'), // 6:00 - 8:00
                    time2: require('@/assets/backgrounds/早上.png'), // 8:00 - 12:00
                    time3: require('@/assets/backgrounds/下午.png'), // 12:00 - 16:00
                    time4: require('@/assets/backgrounds/黄昏.png'), // 16:00 - 18:00
                    time5: require('@/assets/backgrounds/晚上.png'), // 18:00 - 24:00
                    time6: require('@/assets/backgrounds/午夜.png'), // 24:00 - 6:00
                },
                currentTimeImg: '',
            }
        },
        computed: {
            currentImg() {
                // 如果未使用特定图片并开启自动切换，则启用
                if (this.autoTimeChange && !this.imgSrc) {
                    return this.currentTimeImg;
                }
                // 否则使用特定图片或者默认背景
                return this.imgSrc || require('@/assets/backgrounds/星月.jpg');
            }
        },
        mounted() {
            if (this.autoTimeChange) {
                this.updateTimeImg();
                this.timer = setInterval(this.updateTimeImg, 60000);
            }
        },
        beforeUnmount() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        methods: {
            updateTimeImg() {
                const hour = new Date().getHours();

                if (hour >= 6 && hour < 8) {
                    this.currentTimeImg = this.timeMaps.time1;
                } else if (hour >= 8 && hour < 12) {
                    this.currentTimeImg = this.timeMaps.time2;
                } else if (hour >= 12 && hour < 16) {
                    this.currentTimeImg = this.timeMaps.time3;
                } else if (hour >= 16 && hour < 18) {
                    this.currentTimeImg = this.timeMaps.time4;
                } else if (hour >= 18 && hour < 24) {
                    this.currentTimeImg = this.timeMaps.time5;
                } else {
                    this.currentTimeImg = this.timeMaps.time6;
                }
            },
        },
    }
</script>

<style scoped>
    #container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    #container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>