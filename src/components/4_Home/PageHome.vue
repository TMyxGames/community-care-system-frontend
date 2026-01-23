<!-- 未来改动 -->
<template>
    <!-- 横幅 -->
    <div class="banner-container">
        <div class="banner-view">
            <label class="banner-title">你好 {{ userInfo.username || '' }}!</label>
            <label class="banner-subtitle">{{ greeting }}</label>
        </div>
    </div>
    <div class="home-container">
        <!-- 内容 -->
        <glass-layer class="home-view">
            <!-- 轮播区 -->
            <section class="hero-section">

                <el-carousel class="home-carousel" trigger="click" height="100%" v-if="carouselList.length > 0">
                    <el-carousel-item v-for="item in carouselList" :key="item.id">
                        <a :href="item.link" target="_blank">
                            <img :src="$getFileUrl(item.imgUrl)" :alt="item.title" style="width:100%; height:100%; object-fit:cover;"/>
                        </a>
                        <a :href="item.link" target="_blank">
                            <div class="carousel-item-wrapper">
                                <p>{{ item.title }}</p>
                            </div>
                        </a>
                    </el-carousel-item>
                </el-carousel>

            </section>

            <content-list> </content-list>

            <div class="test"></div>

            <h1 id="title">你好</h1>
            <h2 id="subtitle">欢迎来到我的个人页面</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
            <h2 id="subtitle">假设我这里有很多很多内容</h2>
        </glass-layer>
    </div>
</template>

<script>
    import GlassLayer from '../Common/GlassLayer.vue';
    import { useAuthStore } from '@/stores/auth';
    import ContentList from './Common/ContentList.vue'

    export default {
        name: 'PageHome',
        components: { 
            GlassLayer,
            ContentList,
        },
        data() {
            return {
                carouselList: [
                    // {id:1, img: new URL('../../assets/星月.jpg', import.meta.url).href},
                    // {id:2, img: new URL('../../assets/喵可莉.png', import.meta.url).href},
                    // {id:3, img: new URL('../../assets/兔兔.jpg', import.meta.url).herf},
                ]
            }
        },
        setup() {
            const authStore = useAuthStore();
            return { authStore }
        },
        computed: { 
            userInfo() {
                return this.authStore.userInfo || {};
            },
            greeting() {
                const hour = new Date().getHours();
                if (hour < 6) return "夜深了，记得早点休息哦！";
                if (hour < 8) return "早上好";
                if (hour < 12) return "上午好";
                if (hour < 14) return "中午好";
                if (hour < 18) return "下午好";
                return "晚上好";
            }
        },
        created() {
            this.getCarousels();
        },
        methods: {
            async getCarousels() {
                const res = await this.$http.get('/carousel/all');
                this.carouselList = res.data;
            }
        },
    }

</script>

<style scoped>
    .banner-container {
        height: 500px;
        width: 100vw;
        /* padding: clamp(1rem, 3vw, 3rem); */

        /* background-color: rgba(255, 255, 255, 0); */
        /* backdrop-filter: blur(15px); */

        display: flex;
        align-self: center;
        justify-content: center;
        align-items: center;
    }

    .banner-view {
        height: 100%;
        width: 100%;
        max-width: 106rem;
        padding: clamp(1rem, 3vw, 3rem);
        box-sizing: border-box;

        /* background-color: rgba(255, 255, 255, 0.25); */
        /* backdrop-filter: blur(15px); */

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        gap: clamp(1rem, 3vw, 2rem);

    }

    .banner-title {
        font-size: 72px;
        font-weight: 700;
    }

    .banner-subtitle {
        font-size: 36px;
        font-weight: 700;
    }

    .home-container {
        height: 100%;
        width: 100vw;
        padding: clamp(0rem, 2rem);
        box-sizing: border-box;

        /* background-color: #f8f6f6; */

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .home-view {
        height: 100%;
        width: 100%;
        max-width: 100rem;
        
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr));
        gap: clamp(1rem, 1.5vw, 1.5rem);
        
        /* margin: 0 auto; */
        justify-content: center;
    }

    @media (max-width: 60rem) {

        .banner-container {
            height: 280px;
        }
        .banner-title {
            font-size: 36px;
        }
        .banner-subtitle {
            font-size: 24px;
        }
        .home-view {
            grid-template-columns: 1fr;
            /* border-radius: 1.75rem; */
        }




    }

    .home-view> #title {
        font-family: 'HarmonyOS Sans SC';
        font-size: 150px;
        color: #132843;
    }

    .home-view> #subtitle {
        font-family: 'HarmonyOS Sans SC';
        font-size: 50px;
        color: #132843;
    }

    .home-carousel {
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;

        border-radius: 1rem;
        overflow: hidden;
    }

    .home-carousel img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .carousel-item-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        /* padding: 1rem; */
        background-color: rgba(0, 0, 0, 0.25);
        
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
    }

    .test { 
        /* height: 100%; */
        /* width: 100%; */

        background-color: #6191D3;
    }
</style>