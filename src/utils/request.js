import axios from 'axios'
import { useAuthStore } from '@/stores/auth';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL || '',
    timeout: 15000,
})

request.interceptors.request.use(config => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers['Authorization'] = authStore.token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

request.interceptors.response.use(
    res => {
        const result = res.data;
        // 判断是Result封装还是正常返回
        if (result && typeof result === 'object' && 'code' in result) {
            if (result.code === 200) {
                // 如果是Result封装，则直接返回data
                return result.data;
            } else {
                return Promise.reject(result.msg || '错误');
            }
        }
        // 如果不是Result封装，则直接返回
        return result;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();

            const currentPath = window.location.pathname;
            const whiteList = ['/PageHome', '/PageLogin', '/PageRegister'];

            if (whiteList.includes(currentPath)) {
                ElMessage.warning('登录已过期，部分功能已停用');
            } else {
                window.location.href = '/PageLogin';
            }
        }
        return Promise.reject(error);
    }
)

export default request;