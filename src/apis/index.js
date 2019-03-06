import axios from "axios";
import hmacSha256 from "../utils/hmacSha256.js";
import baseConstant from "../constant/index.js";
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
// 按条件查询车辆信息对象
var findBusInfo = function(params, callback) {
  var url = "/wjtran/busInfo/find";
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
// 获取公交公司提供的通知公告信息列表
var ggjt_list = function(params, callback) {
  var url = "/ggjt/list";
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
// 获取公告详情
var ggjt_info = function(id, callback) {
  var url = "/ggjt/detail?id=" + id;
  instance
    .get(url)
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};
// 获取数梦code接口
// http://112.25.130.117:10067/uaa/authorize?client_id=bigapp&response_type=code&scope=openid&redirect_uri=https://gjcx.smartwj.net:8999/dist/index.html
var getSmCode = function(callback) {
  // var url =
  //   "/uaa/authorize?client_id=bigapp&response_type=code&scope=openId&redirect_uri=https://gjcx.smartwj.net:8999/dist/index.html";
  var url =
    "/uaa/authorize?client_id=bigapp&response_type=code&scope=openId&redirect_uri=https://gjcx.smartwj.net:8999/dist/index.html&refresh_token=BC_-KW21RqcFkmRzMkwD6J7P5zM8UI1IAW1vYmlsZQ";
  instance
    .get(url)
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      callback(error);
    });
};

var getSmToken = function(params, callback) {
  // 获取签名和认证
  var queryString = "";
  for (var k in params) {
    queryString += k + "=" + params[k] + "&";
  }
  queryString = queryString.substr(0, queryString.length - 1);
  var dateString = hmacSha256.getFilterTime();
  var singnString = hmacSha256.hmacSha256(queryString, dateString, "POST");
  var url = "/service/api/66bfc0f090ad41e497d1f28aa6ef3318/oauth2/token";
  var Auth =
    "Digest Algorithm=HMAC-SHA256,AccessKeyId=" +
    baseConstant.smAppid +
    ",TimeStamp=" +
    dateString +
    ",Signature=" +
    singnString +
    "";
  console.log(queryString);
  console.log(Auth);
  instance
    .post(url, params, {
      headers: {
        Authorization: Auth
      }
    })
    .then(function(res) {
      callback(res);
    })
    .catch(function(error) {
      var obj = error;
      obj.failure = true;
      callback(obj);
    });
};
var getSmUserid = function(params, callback) {
  var url =
    "https://dtopen.smartwj.net:6002/service/api/66bfc0f090ad41e497d1f28aa6ef3318/oauth2/token";
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
// D:\myStudy\vue\map-gd\wj-gj\dist.zip
// https://gjcx.smartwj.net:8999/fgw/interfaces/dtopen/personal/getBriefUser?code=
export default {
  getRoutesInfo: getRoutesInfo,
  getWalkingInfo: getWalkingInfo,
  searchByKeyword: searchByKeyword,
  searchStationByRange: searchStationByRange,
  findChannelBySguids: findChannelBySguids,
  matchChannel: matchChannel,
  findBusInfo: findBusInfo,
  ggjt_list: ggjt_list,
  ggjt_info: ggjt_info,
  getSmCode: getSmCode,
  getSmToken: getSmToken,
  getSmUserid: getSmUserid
};
