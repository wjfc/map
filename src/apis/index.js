import axios from "axios";
var instance = axios.create({});
// 获取公交路线规划详情
var getRoutesInfo = function(params, callback) {
  var url = "/v3/direction/transit/integrated";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    });
};
// 模糊搜索接口
var searchByKeyword = function(params, callback) {
  var url = "/v3/assistant/inputtips";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    });
};
export default {
  getRoutesInfo: getRoutesInfo,
  searchByKeyword: searchByKeyword
};
