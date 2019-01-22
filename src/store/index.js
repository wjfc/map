import Vue from "vue";
import Vuex from "vuex";
import apis from "@/apis/index.js";
Vue.use(Vuex);
const state = {
  location_now: "", //当前定位位置信息
  historyList: [] //历史记录或者搜索记录
};
// 同步处理
const mutations = {
  changeNowLocation(state, obj) {
    state.location_now = obj;
    localStorage.setItem("location_now", obj);
  },
  changeHistoryList(state, arr) {
    state.historyList = arr;
  }
};
// 异步处理
const actions = {
  // 对应changeHistoryList
  getHistoryList(context, params) {
    //模糊搜索
    apis.searchByKeyword(params, function(res) {
      context.commit("changeHistoryList", res.data.tips);
    });
  }
};
const store = new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions
});
export default store;
