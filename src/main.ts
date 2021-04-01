import { createApp } from 'vue';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';


import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import packageJSon from '../package.json';
localStorage.version = packageJSon.version;
const app = createApp(App)
app.use(store);
app.use(router)
app.use(ElementPlus, { size: 'small' });
app.mount('#app');