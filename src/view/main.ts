import Vue from 'vue';
import App from '@/view/App.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ElementUIFormVerify from '@/lib/main';

Vue.use(ElementUI);
Vue.use(ElementUIFormVerify);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
