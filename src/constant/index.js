if (process.env.NODE_ENV == "development") {
  var obj = {
    adcode: "320100", //南京区域code
    adname: "南京",
    key: "c23636c65f09867acf3ffb4ca41e44f8"
  };
} else {
  var obj = {
    adcode: "320509", //吴江区域code
    adname: "吴江",
    key: "c23636c65f09867acf3ffb4ca41e44f8"
  };
}
export default obj;
