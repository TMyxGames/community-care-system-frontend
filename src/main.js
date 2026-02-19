import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'
import { VueUiRadar } from "vue-data-ui";
import "vue-data-ui/style.css";
import axios from 'axios'
import router from './router/GlobalJump'

import './styles/reset.css'
import './styles/BDmarkdown.css'
import './styles/theme.css'

// 自己设定的接口地址
import { getFullUrl } from '@/utils/config';
import request from './utils/request'
import md from './utils/markdown'

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$http = request
app.config.globalProperties.$getFileUrl = getFullUrl
app.config.globalProperties.$md = md

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(echarts)
app.use(VueUiRadar)

app.mount('#app')

