import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

createApp(App).use(router).mount('#app');
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; // 在请求头中添加token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
