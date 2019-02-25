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
// 获取步行路线规划
var getWalkingInfo = function(params, callback) {
  var url = "/v3/direction/walking";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    });
};
// 高德模糊搜索接口
var searchByKeyword = function(params, callback) {
  var url = "/v3/assistant/inputtips";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};

/**
 *吴江公交相关接口
 *
 */
// 根据当前经纬度以及范围搜索附近的车站接口
var searchStationByRange = function(params, callback) {
  var url = "/wjtran/station/search";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};
// 线路操作查询，根据线路名称查询公交线路
var findChannelBySguids = function(params, callback) {
  var url = "/wjtran/channel/find";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};
// 根据线路名称，起始站名称匹配公交线路
var matchChannel = function(params, callback) {
  var url = "/wjtran/channel/match";
  instance
    .get(url, {
      params: params
    })
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};
// http://localhost:8080/wjtran/busInfo/find?lguids=0000000000LINELINEINFO15121021854704
// http://localhost:8080/wjtran/channelStation/find?lguids=0000000000LINELINEINFO15121021854704
export default {
  getRoutesInfo: getRoutesInfo,
  getWalkingInfo: getWalkingInfo,
  searchByKeyword: searchByKeyword,
  searchStationByRange: searchStationByRange,
  findChannelBySguids: findChannelBySguids,
  matchChannel:matchChannel
};
