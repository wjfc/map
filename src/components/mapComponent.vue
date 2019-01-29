<template>
  <div class="mapBox">
    <div class="map" id="mapApp"></div>
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
      showFlags: this.dataFLag
    };
  },
  mounted() {
    this.mapInit();
  },
  props: ["dataFLag"],
  methods: {
    ...mapMutations(["changeNowLocation"]),
    mapInit() {
      this.map = new AMap.Map("mapApp", {
        zoom: 13,
        resizeEnable: true
      });
      this.map.setCity(baseConstant.adname); //定位到城市。
      var self = this;
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
              '<img src="../../static/images/location.png" style="width:36px;height:36px" id="locationIcon"/>'
          },
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: self.showFlags, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: self.showFlags //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        self.map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
        AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        function onComplete(data) {
          // 需要保存位置信息
          var posX = data.position.getLng();
          var poxY = data.position.getLat();
          //self.$store.commit("changeNowLocation", posX + "," + poxY);
          self.changeNowLocation(posX + "," + poxY);
        }
        function onError(data) {
          console.log(data);
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
