import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'
import { VueUiRadar } from "vue-data-ui";
import "vue-data-ui/style.css";
import axios from 'axios'
import VueRouter from 'vue-router'
import GlobalHeaderJump from './router/GlobalJump'
import './styles/reset.css'
// import 'github-markdown-css/github-markdown.css'

// 自己设定的接口地址
import { getFullUrl } from '@/utils/config';

const pinia = createPinia()
const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:8081'
app.config.globalProperties.$http = axios
app.config.globalProperties.$getFileUrl = getFullUrl

app.use(pinia)
app.use(VueRouter)
app.use(ElementPlus)
app.use(echarts)
app.use(VueUiRadar)
app.use(GlobalHeaderJump)

app.mount('#app')

