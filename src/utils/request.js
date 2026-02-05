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
        if (result.code === 200) {
            return result.data;
        } else {
            return Promise.reject(result.msg);
        }
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
            window.location.href = '/auth';
            console.error('登录已过期，请重新登录');
        }
        return Promise.reject(error);
    }
)

export default request;