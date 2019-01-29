// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import store from "@/store/index.js";
import App from "./App";
import router from "./router";
// 引入swiper组件
import VueAwesomeSwiper from "vue-awesome-swiper";
// require styles
import "swiper/dist/css/swiper.css";
Vue.use(VueAwesomeSwiper /* { default global options } */);
// 引入swiper组件
import "../static/css/reset.css"; //css重置或者清除默认样式
import "lib-flexible/flexible"; //引入rem布局方式
import "../static/wj_fonts/style.css";
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  data: {
    // Bus: new Vue() //自定义组件用于组件之间的数据传递
  },
  router,
  store,
  components: { App },
  template: "<App/>"
});
