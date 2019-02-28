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
    key: "886d5915b8bb2336109e4e4095e9ebb3"
  };
}
export default obj;
