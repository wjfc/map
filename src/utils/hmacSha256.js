import CryptoJS from "crypto-js";
import baseContent from "../constant/index";
var hmacSha256 = function(queryString, timeStemap, method, secret) {
  var signStr = method + "&" + encodeURIComponent("/") + "&";
  var TimeStamp = encodeURIComponent(timeStemap).replace("%20", "+") + "&";
  signStr += TimeStamp + encodeURIComponent(queryString);
  var _t = CryptoJS.HmacSHA256(signStr, secret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(_t);
  return hashInBase64;
};
var hmacSha256_send = function(queryString, timeStemap, method, secret) {
  var queryString = queryString.replace(/%(?![0-9a-fA-F]{2})/gi, "%25");
  var signStr = method + "&" + encodeURIComponent("/") + "&";
  signStr += timeStemap + "&" + encodeURIComponent(queryString);
  var _t = CryptoJS.HmacSHA256(signStr, secret);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(_t);
  return hashInBase64;
};
var getFilterTime = function() {
  var time = new Date();
  var year = time.getUTCFullYear();
  var month = time.getUTCMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var date =
    time.getUTCDate() < 10 ? "0" + time.getUTCDate() : time.getUTCDate();

  var hour =
    time.getUTCHours() < 10 ? "0" + time.getUTCHours() : time.getUTCHours();
  var minutes =
    time.getUTCMinutes() < 10
      ? "0" + time.getUTCMinutes()
      : time.getUTCMinutes();
  var seconds =
    time.getUTCSeconds() < 10
      ? "0" + time.getUTCSeconds()
      : time.getUTCSeconds();

  return (
    year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds
  );
};
export default {
  hmacSha256: hmacSha256,
  hmacSha256_send: hmacSha256_send,
  getFilterTime: getFilterTime
};
