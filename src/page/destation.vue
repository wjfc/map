<template>
  <div class="destation">
    <basicHeader :desName="msg"></basicHeader>
    <mapComponent class="mapComponent2" ref="mapObj" :dataFLag="false"></mapComponent>
    <div class="walking-tips" v-show="walkingTips" @click="closeWalkingTips">{{tipsInfo}}</div>
    <div class="tips">
      <div class="tips-l">
        <p>{{options.name}}</p>
        <p>{{options.address}}</p>
      </div>
      <div class="tips-r" @click="busList()">
        <p class="icon-wj_ic_onfoot"></p>
        <p>去这里</p>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import basicHeader from "@/components/basicHeader"; //通用头部组件
import mapComponent from "@/components/mapComponent"; //地图组件
import baseConstant from "@/constant/index.js";
export default {
  name: "destation",
  data() {
    return {
      msg: "目的地",
      options: {},
      walkingTips: false,
      tipsInfo: "路程较短建议步行!",
      touchMark: null, //长按描点数据
      walkingTime: null
    };
  },
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: decodeURI(this.$route.query.name),
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location
    };
    setTimeout(function() {
      self.addMark(self.$route.query.location);
    }, 500);
    this.mapListener();
  },
  methods: {
    busList() {
      var self = this;
      // 跳转前需要做判断，路程短的话，提示步行。
      if (!this.$store.state.location_now) {
        var origin = localStorage.getItem("location_now");
      } else {
        var origin = this.$store.state.location_now;
      }
      var params = {
        origin: origin, //当前位置定位
        destination: this.options.location, //目的地位置定位
        key: baseConstant.key,
        city: baseConstant.adname
      };
      apis.getRoutesInfo(params, function(res) {
        if (res.data.info == "OK") {
          if (res.data.route.transits.length > 0) {
            self.$router.push({
              path: "/busList",
              query: {
                name: encodeURI(self.options.name),
                address: encodeURI(self.options.address),
                location: self.options.location
              }
            });
          } else {
            self.tipsInfo = "路程较短建议步行!";
            self.showWalkTips();
          }
        } else {
          self.tipsInfo = "路程较远，无公交方案提供！";
          self.showWalkTips();
        }
      });
    },
    addMark(location) {
      var self = this;
      var endIcon = new AMap.Icon({
        size: new AMap.Size(29, 35), // 图标尺寸
        image: "./static/images/endIcon.png", // Icon的图像
        imageSize: new AMap.Size(29, 35) // 根据所设置的大小拉伸或压缩图片
      });
      if (this.touchMark) {
        this.clearTouchIcon();
      }
      this.touchMark = new AMap.Marker({
        position: new AMap.LngLat(
          location.split(",")[0],
          location.split(",")[1]
        ),
        offset: new AMap.Pixel(-10, -10),
        icon: endIcon,
        title: "010",
        zoom: 13,
        map: this.map
      });
      this.$refs.mapObj.map.add([this.touchMark]);
      this.$refs.mapObj.map.setFitView([this.touchMark]);
    },
    clearTouchIcon() {
      this.$refs.mapObj.map.remove(this.touchMark);
      this.touchMark = null;
    },
    // 路程较短时的展示
    showWalkTips() {
      this.walkingTips = true;
      var self = this;
      if (this.walkingTime) {
        clearInterval(this.walkingTime);
      }
      this.walkingTime = setTimeout(function() {
        self.walkingTips = false;
      }, 3000);
    },
    // 手动关闭提示框
    closeWalkingTips() {
      clearInterval(this.walkingTime);
      this.walkingTime = null;
      this.walkingTips = false;
    },
    mapListener() {
      var self = this;
      this.$refs.mapObj.map.on("touchstart", function(ev) {
        self.touchTime = new Date().getTime();
      });
      this.$refs.mapObj.map.on("touchend", function(ev) {
        var tempTime = new Date().getTime();
        if (tempTime - self.touchTime > 500) {
          //  定义大于500毫秒，算长按
          // 可以拿到经纬度信息,然后根据经纬度去描点以及，调用接口获取该坐标的详情信息。
          var posX = ev.lnglat.getLng();
          var poxY = ev.lnglat.getLat();
          var params = {
            key: baseConstant.key,
            location: posX + "," + poxY
          };
          apis.searchRege(params, function(res) {
            var result = res.data.regeocode;
            var address = result.formatted_address;
            var province = result.addressComponent.province;
            var city = result.addressComponent.city;
            var addressName = result.formatted_address.replace(province, "");
            addressName = addressName.replace(city, "");
            result.addressNum =
              result.addressComponent.streetNumber.street +
              result.addressComponent.streetNumber.number;

            self.options = {
              name: decodeURI(addressName),
              address: decodeURI(result.addressNum),
              location: params.location
            };
            self.addMark(params.location);
          });
        }
      });
    }
  },
  computed: {},
  components: {
    basicHeader: basicHeader,
    mapComponent: mapComponent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.destation .walking-tips {
  position: absolute;
  top: 128px;
  left: 50%;
  transform: translateX(-50%);
  width: 690px;
  height: 160px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
  line-height: 160px;
  font-size: 30px;
}
.destation .tips {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 690px;
  height: 208px;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: #fff;
  border-radius: 16px;
}
.tips-l {
  margin-left: 40px;
}
.tips-l p:first-child {
  font-size: 32px;
  color: #000;
  margin-bottom: 20px;
}
.tips-l p:last-child {
  font-size: 24px;
  color: #999999;
}
.tips-r {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  color: #37cabe;
}
.tips-r p:first-child {
  font-size: 72px;
}
.tips-r p:last-child {
  font-size: 24px;
}
/* 地图相关 */
.mapComponent2 {
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}
/* 更改左下角默认样式  */
.map {
  width: 100%;
  height: 100%;
}
/* 更改左下角默认样式 */

.amap-logo,
.amap-copyright {
  display: none !important;
}
.mapComponent2 .amap-geolocation-con,
.mapComponent2 .amap-toolbar {
  bottom: 278px !important;
}
.amap-touch-toolbar .amap-zoomcontrol {
  bottom: 0 !important;
}
.amap-geolocation-con .amap-geo {
  background: url("../../static/images/target2.png") 50% 50% no-repeat;
  background-color: #fff;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  background-size: 100% 100%;
}
</style>
