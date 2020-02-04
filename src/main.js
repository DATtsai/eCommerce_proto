// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW'; // 引用語系檔內容

import App from './App';
import router from './router';
import './bus';
import currencyFiliter from './filters/currency';
import dateFormat from './filters/localDate';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VeeValidate, {events:'input|blur',});
VeeValidate.Validator.localize('zh_TW', zhTWValidate);

// vue-loading-overlay為元件，採用全域啟用，供所有元件都能取用
Vue.component('Loading', Loading);

// 全域filter方法註冊
Vue.filter('currency', currencyFiliter);
Vue.filter('localDate', dateFormat);

// 將後端所給的session資訊存到前端cookie，並在每次請求時附帶cookie資訊給後端
// https://github.com/axios/axios
axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

// 啟用navigation guards
router.beforeEach((to, from, next)=>{
  console.log('to', to, 'from', from, 'next', next);
  if(to.meta.requiresAuth){
    // console.log('這裡需要驗證');
    const api = `${process.env.APIPATH}/api/user/check`;
    const vm = this;
    // 此處是於vue實體外使用router方法，故無法使用axios+vue方法呼叫，改用axios進行處理
    axios.post(api)
      .then((response)=>{
        console.log(response.data);
        if(response.data.success){
          next();
        } else {
          next({
            path: '/login',
          });
        };
      });
  } else {
    next();
  }
});
