<template>
  <div class="mapBox">
    <div class="map" id="mapApp"></div>
    <div class="mapError" v-if="mapErrorFlag" @click="refreshMap">
      <img src="../../static/images/networkError.png" alt>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import baseConstant from "@/constant/index.js";
export default {
  name: "mapApp",
  data() {
    return {
      msg: "地图",
      map: {}, //高德地图对象,
      showFlags: this.dataFLag,
      mapErrorFlag: true
    };
  },
  mounted() {
    this.mapInit();
  },
  props: ["dataFLag", "dataFrom"],
  methods: {
    ...mapMutations(["changeNowLocation"]),
    mapInit() {
      this.map = new AMap.Map("mapApp", {
        zoom: 13,
        resizeEnable: true
      });
      this.mapErrorFlag = false;
      this.map.setCity(baseConstant.adname); //定位到城市。
      var self = this;
      // self.changeNowLocation("120.638966" + "," + "31.151753"); //临时定位到吴江广播电视台

      AMap.plugin(["AMap.ToolBar", "AMap.Geolocation"], function() {
        var toolbar = new AMap.ToolBar({});
        self.map.addControl(toolbar);
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          markerOptions: {
            //自定义定位点样式，同Marker的Options
            offset: new AMap.Pixel(-16, -16),
            content:
              '<img src="./static/images/location.png" style="width:36px;height:36px" id="locationIcon"/>'
          },
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: self.showFlags, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: self.showFlags //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        self.map.addControl(geolocation);
        geolocation.getCurrentPosition(); // 调用高德定位方法。

        AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
        AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        function onComplete(data) {
          // 需要保存位置信息
          // console.log(data);
          var posX = data.position.getLng();
          var poxY = data.position.getLat();
          self.$store.commit("changeNowLocation", posX + "," + poxY);
          self.changeNowLocation(posX + "," + poxY);
          if (self.dataFrom == "home") {
            // 如果是主页，则调用吴江公交，搜索最近的车站接口
            self.$emit("wjtran_search");
          }
        }
        function onError(data) {
          console.log(data);
          // 地图加载失败时，友好提示。
          // self.mapError();
          if (self.dataFrom == "home") {
            // 如果是主页，则调用吴江公交，搜索最近的车站接口
            self.$emit("wjtran_search");
          }
        }
        document
          .getElementsByClassName("amap-geolocation-con")[0]
          .addEventListener(
            "click",
            function() {
              geolocation.options.panToLocation = true;
              geolocation.options.zoomToAccuracy = true;
              geolocation.getCurrentPosition();
            },
            false
          );
      });
    },
    mapError() {
      this.mapErrorFlag = true;
    },
    refreshMap() {
      window.location.reload();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.mapError {
  position: absolute;
  top: 288px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 280px;
}
.mapError img {
  width: 100%;
  height: 100%;
}
</style>
