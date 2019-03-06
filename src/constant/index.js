if (process.env.NODE_ENV == "development" && false) {
  var obj = {
    adcode: "320100", //南京区域code
    adname: "南京",
    key: "886d5915b8bb2336109e4e4095e9ebb3"
  };
} else {
  var obj = {
    adcode: "320509", //吴江区域code
    adname: "吴江",
    key: "886d5915b8bb2336109e4e4095e9ebb3",
    smAppid: "bigapp", //数梦开放平台appid
    smAppSecret: "123456", //数梦开发平台秘钥
    mesAppid: "0000vYvOSz1", //公交appid
    mesAppSecret: "ab4740eb-1ac8-4bb6-ae1e-fd2618a4cfa8", //公交秘钥
    redirect_uri: "https://gjcx.smartwj.net:8999/dist/index.html"
  };
}
export default obj;
