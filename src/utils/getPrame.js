function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.href.match(reg); //获取url中"?"符后的字符串并正则匹配
  console.log("r", r);
  var context = "";
  if (r != null) context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined"
    ? ""
    : context;
}
export default GetQueryString;
