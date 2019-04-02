import axios from "axios";
import $ from "jquery";
import hmacSha256 from "../utils/hmacSha256.js";
import baseConstant from "../constant/index.js";
var instance = axios.create({});
// 获取公交路线规划详情
var getRoutesInfo = function(params, callback) {
  var url = "https://restapi.amap.com/v3/direction/transit/integrated";
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
  var url = "https://restapi.amap.com/v3/direction/walking";
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
  var url = "https://restapi.amap.com/v3/assistant/inputtips";
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

var getSmToken2 = function(params, callback) {
  // 获取签名和认证
  var queryString = "";
  for (var k in params) {
    queryString += k + "=" + params[k] + "&";
  }
  queryString = queryString.substr(0, queryString.length - 1);
  var dateString = hmacSha256.getFilterTime();
  var singnString = hmacSha256.hmacSha256(
    queryString,
    dateString,
    "POST",
    baseConstant.smAppSecret
  );
  var url = "/service/api/b6c30553454d4b719c3248f58d49ef5b/oauth2/token";
  var Auth =
    "Digest Algorithm=HMAC-SHA256,AccessKeyId=" +
    baseConstant.smAppid +
    ",TimeStamp=" +
    dateString +
    ",Signature=" +
    singnString +
    "";
  $.ajax({
    url: url + "?" + queryString,
    type: "post",
    dataType: "json",
    headers: {
      Authorization: Auth
    },
    success: function(res) {
      callback(res);
    },
    error: function(e) {
      callback(e);
    }
  });
};

var getSmUserid2 = function(params, callback) {
  var queryString = "";
  for (var k in params) {
    queryString += k + "=" + params[k] + "&";
  }
  queryString = queryString.substr(0, queryString.length - 1);
  var dateString = hmacSha256.getFilterTime();
  var singnString = hmacSha256.hmacSha256(
    queryString,
    dateString,
    "GET",
    baseConstant.smAppSecret
  );
  var url =
    "/service/api/e4068dda62504ce4a518bcf8b955723e/openApi/user/getDetailedNormalUser";
  var Auth =
    "Digest Algorithm=HMAC-SHA256,AccessKeyId=" +
    baseConstant.smAppid +
    ",TimeStamp=" +
    dateString +
    ",Signature=" +
    singnString +
    "";
  $.ajax({
    url: url + "?" + queryString,
    type: "get",
    dataType: "text",
    headers: {
      Authorization: Auth
    },
    success: function(res) {
      callback(res);
    },
    error: function(e) {
      callback(e);
    }
  });
};
var sendMsg2 = function(obj, callback) {
  var url = "/Message/send";
  var timeStamp = new Date().getTime();
  var params = {
    appId: baseConstant.mesAppid,
    messageType: "text",
    // pushChannel: 1,
    text: obj.text,
    title: obj.title,
    toUserId: obj.toUserId
  };
  var queryString = "";
  for (var k in params) {
    queryString += k + "=" + params[k] + "&";
  }
  queryString = queryString.substr(0, queryString.length - 1);

  var singnString = hmacSha256.hmacSha256_send(
    queryString,
    timeStamp,
    "POST",
    baseConstant.mesAppSecret
  );
  queryString += "&sign=" + singnString + "&timeStamp=" + timeStamp;
  params.sign = singnString;
  params.timeStamp = timeStamp;
  // 当contentType设置为application/json;charset=UTF-8时，需要将参数转换为标准的json字符串形式
  $.ajax({
    url: url,
    data: JSON.stringify(params),
    dataType: "json",
    type: "post",
    contentType: "application/json;charset=UTF-8",
    success: function(res) {
      callback(res);
    },
    error: function(e) {
      callback(e);
    }
  });
};

var callBusWarn = function(params, callback) {
  var url = "/fgw/interfaces/bus/callBusWarn";
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
// https://user.smartwj.net:10006/uaa/authorize?client_id=a2c2c57f79df47d7addfae4c1ae090be&response_type=code&scope=openId&redirect_uri=https://app.smartwj.net:10030/dist/index.html
//  https://user.smartwj.net:10006/uaa/authorize?client_id=a2c2c57f79df47d7addfae4c1ae090be&response_type=code&scope=openId&redirect_uri=https://gjcx.smartwj.net:8999/dist/index.html
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
  getSmToken2: getSmToken2,
  getSmUserid2: getSmUserid2,
  sendMsg2: sendMsg2,
  callBusWarn: callBusWarn
};
