<template>
  <div class="busMap-preivew">
    <basicHeader :desName="options.name"></basicHeader>
    <mapComponent class="mapComponent2" ref="mapObj" :dataFLag="false"></mapComponent>
    <div class="mapPreview">
      <swiper
        :options="swiperOption"
        ref="mySwiper"
        @slideChangeTransitionEnd="slideChangeTransitionEnd"
      >
        <!-- slides -->
        <swiper-slide v-for="(v,i) in steps" :key="i">
          <div class="stepItem">
            <p v-show="v.desc">{{v.desc}}</p>
            <p v-show="v.distance">{{v.distance}}</p>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev1 swiper-button icon-wj_ic_left" slot="button-prev"></div>
        <div class="swiper-button-next1 swiper-button icon-wj_ic_right" slot="button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";
import basicHeader from "@/components/basicHeader"; //通用头部组件
import mapComponent from "@/components/mapComponent"; //地图组件
import { swiper, swiperSlide } from "vue-awesome-swiper"; //swiper轮播效果
export default {
  name: "busMap",
  data() {
    return {
      msg: "bus地图",
      options: {},
      activeIndex: 0,
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        navigation: {
          nextEl: ".swiper-button-next1",
          prevEl: ".swiper-button-prev1"
        },
        activeIndex: 0
      },
      origin: "", //七点
      destination: "", //终点
      styleObject: {},
      walkLines: [], //全路线绘制
      busLines: [],
      transits: [], //高德返回路线数组
      mysegments: [],
      stepIndex: 0, //按步执行的索引,
      steps: [], //步骤数组,
      activeShowLine: null //按步执行索引后当前展示的路线
    };
  },
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: decodeURI(this.$route.query.name),
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location,
      id: this.$route.query.id,
      type: this.$route.query.type,
      activeIndex: this.$route.query.activeIndex, //方案
      index: this.$route.query.index, //方案中的某一步
      point: this.$route.query.point
    };
    this.destination = this.$route.query.location; //终点
    this.getRoutes(this.options.type);
  },
  methods: {
    getRoutes(i) {
      var self = this;
      if (!this.$store.state.location_now) {
        var origin = localStorage.getItem("location_now");
      } else {
        var origin = this.$store.state.location_now;
      }
      this.origin = origin;
      var params = {
        origin: origin, //当前位置定位
        destination: this.options.location, //目的地位置定位
        key: baseConstant.key,
        city: baseConstant.adname,
        strategy: this.options.type
      };
      apis.getRoutesInfo(params, function(res) {
        self.showRoutes(res.data.route.transits);
      });
    },
    showRoutes(arr) {
      this.transits = arr;
      this.getMysegments();
      this.drawStartAndEnd(); //绘制起点和终点
      this.drawbusLine(arr[this.options.activeIndex]);
    },
    // 处理高德导航返回的数据。
    getMysegments() {
      // 处理高德导航返回的数据。
      var mysegments = [];
      var segments = this.transits[this.options.activeIndex].segments;
      segments.forEach((v, i) => {
        var obj = {};
        // 大于50米的才算步行逻辑
        if (v.walking.steps && v.walking.distance >= 50) {
          // 步行
          obj.walking = v.walking;
        }
        if (v.bus.buslines.length > 0) {
          // 根据吴江公交接口做替换
          obj.buslines = v.bus.buslines;
        }
        mysegments.push(obj);
      });
      this.mysegments = mysegments;
      this.getSteps(this.mysegments);
    },
    // 添加点方法
    addMark(location) {
      var self = this;
      var endIcon = new AMap.Icon({
        size: new AMap.Size(29, 35), // 图标尺寸
        image: "../../static/images/mark0.png", // Icon的图像
        imageSize: new AMap.Size(29, 35) // 根据所设置的大小拉伸或压缩图片
      });
      var marker = new AMap.Marker({
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
      this.$refs.mapObj.map.add([marker]);
      this.$refs.mapObj.map.setFitView([marker]);
    },
    // 绘制路线
    drawbusLine(obj) {
      try {
        //先清除 已绘制的线。
        var self = this;
        this.walkLines.forEach((v, i) => {
          self.$refs.mapObj.map.remove(v);
        });
      } catch (error) {}

      //绘制乘车的路线
      this.getpolyline(obj);
    },
    // 绘制起点和终点
    drawStartAndEnd(obj) {
      // 绘制起点
      var startPosition = new AMap.Marker({
        map: this.$refs.mapObj.map,
        position: [this.origin.split(",")[0], this.origin.split(",")[1]], //基点位置
        icon: "../../static/images/startIcon.png",
        zIndex: 10
      });
      // 绘制终点
      var endPosition = new AMap.Marker({
        map: this.$refs.mapObj.map,
        position: [
          this.destination.split(",")[0],
          this.destination.split(",")[1]
        ], //基点位置
        icon: "../../static/images/endIcon.png",
        zIndex: 10
      });
    },
    // /绘制乘车的路线
    getpolyline(obj) {
      var self = this;
      var segments = obj.segments;
      segments.forEach((v, i) => {
        // 绘制步行
        if (v.walking) {
          var walkPath = [];
          var walkLine = null;
          if (v.walking.steps) {
            for (var j = 0; j < v.walking.steps.length; j++) {
              var step = v.walking.steps[j];
              var polylineArray = step.polyline.split(";");
              for (var k = 0; k < polylineArray.length; k++) {
                walkPath.push([
                  polylineArray[k].split(",")[0],
                  polylineArray[k].split(",")[1]
                ]);
              }
            }
            walkLine = new AMap.Polyline({
              path: walkPath,
              isOutline: true,
              outlineColor: "#ffeeee",
              borderWeight: 2,
              strokeWeight: 5,
              strokeColor: "#37cabe",
              lineJoin: "round",
              strokeStyle: "dashed",
              zIndex: 10
            });
            self.walkLines.push(walkLine);
            self.$refs.mapObj.map.add(walkLine);
            // self.$refs.mapObj.map.setFitView([walkLine]);
          }
        }
        if (v.bus.buslines.length > 0) {
          var polyline = v.bus.buslines[0].polyline.split(";");
          var busPath = [];
          var busLine = null;
          polyline.forEach((v, i) => {
            busPath.push([v.split(",")[0], v.split(",")[1]]);
          });

          busLine = new AMap.Polyline({
            path: busPath,
            isOutline: true,
            outlineColor: "white",
            strokeColor: "#37cabe", //线颜色
            strokeOpacity: 0.5, //线透明度
            lineJoin: "round",
            strokeWeight: 6, //线宽
            zIndex: 9
          });
          self.walkLines.push(busLine);
          self.$refs.mapObj.map.add(busLine);
          // self.$refs.mapObj.map.setFitView([busLine]);
        }
        self.$refs.mapObj.map.setFitView();
      });
    },
    // 按步执行
    getSteps(arr) {
      var self = this;
      var steps = [];
      // 开始出发
      steps.push({
        desc: "从我的位置出发",
        distance: ""
      });
      if (self.options.point == "start") {
        self.stepIndex = 0;
      }
      arr.forEach((v, i) => {
        if (v.walking) {
          if (v.buslines) {
            var s = self.showSame(v, i);
            if (s) {
              steps.push({
                desc: "站内换乘" + v.walking.distance + "m",
                distance: "",
                draw: v.walking.steps
              });
            } else {
              steps.push({
                desc: "步行到" + v.buslines[0].departure_stop.name,
                distance: v.walking.distance + "m",
                draw: v.walking.steps
              });
            }
          } else {
            steps.push({
              desc: "步行" + v.walking.distance + "m",
              distance: "",
              draw: v.walking.steps
            });
          }
          if (self.options.point == "walking" && this.options.index == i) {
            self.stepIndex = steps.length - 1;
          }
        }
        if (v.buslines) {
          steps.push({
            desc: v.buslines[0].name,
            distance:
              "从" +
              v.buslines[0].departure_stop.name +
              "到" +
              v.buslines[0].arrival_stop.name,
            draw: v.buslines[0].polyline
          });
          if (self.options.point == "busline" && this.options.index == i) {
            self.stepIndex = steps.length - 1;
          }
        }
      });
      // 终点
      steps.push({
        desc: "到达" + this.options.name,
        distance: ""
      });
      if (self.options.point == "end") {
        self.stepIndex = steps.length - 1;
      }
      this.steps = steps;
      self.swiper.slideTo(self.stepIndex, 0, function() {});
    },
    // 是否展示同站换乘
    showSame(v, i) {
      if (i == 0) {
        return "";
      }
      var s =
        v.buslines[0].departure_stop.name ==
        this.mysegments[i - 1].buslines[0].arrival_stop.name
          ? "同站换乘"
          : "";
      return s;
    },
    slideChangeTransitionEnd() {
      this.stepIndex = this.swiper.activeIndex;
      this.reDrawLine(this.steps[this.stepIndex].draw);
    },
    // 按布绘制路线
    reDrawLine(obj) {
      switch (typeof obj) {
        case "undefined":
          // 不做处理
          break;
        case "object":
          var polylinesStr = "";
          var path = [];
          obj.forEach(function(v, i) {
            polylinesStr += ";" + v.polyline;
          });
          polylinesStr = polylinesStr.substr(1);
          var polyline = polylinesStr.split(";");
          polyline.forEach((v, i) => {
            path.push([v.split(",")[0], v.split(",")[1]]);
          });
          this.drawCurrentLine(path);
          break;
        case "string":
          var polyline = obj.split(";");
          var path = [];
          polyline.forEach((v, i) => {
            path.push([v.split(",")[0], v.split(",")[1]]);
          });
          this.drawCurrentLine(path);
          break;
      }
    },
    drawCurrentLine(path) {
      if (this.activeShowLine) {
        this.$refs.mapObj.map.remove(this.activeShowLine);
      }
      this.activeShowLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: "white",
        strokeColor: "red", //线颜色
        strokeOpacity: 0.5, //线透明度
        lineJoin: "round",
        strokeWeight: 6, //线宽
        zIndex: 12
      });
      this.$refs.mapObj.map.add(this.activeShowLine);
      this.$refs.mapObj.map.setFitView(this.activeShowLine);
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  components: {
    basicHeader: basicHeader,
    mapComponent: mapComponent,
    swiper,
    swiperSlide
  },
  filters: {
    // 格式化消耗时间
    formatTime(v) {
      var mins = Math.ceil(v / 60);
      var hour = Math.floor(mins / 60);
      hour = hour > 0 ? hour + "小时" : "";
      var minute = (mins % 60) + "分钟";
      return hour + minute;
    },
    formatDistance(v) {
      return parseFloat(v / 1000).toFixed(2) + "km";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 底部样式开始 */
.mapPreview {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 248px;
  background-color: #fff;
}
.stepItem {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 80%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 84px 0;
  box-sizing: border-box;
}
.stepItem p:first-child {
  font-size: 38px;
  color: #000;
  line-height: 38px;
}
.stepItem p:last-child {
  font-size: 26px;
  line-height: 26px;
  color: #999;
}
/* 底部样式结束 */
/* swiper 左右箭头样式 */
.swiper-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  color: #000;
  z-index: 9999;
}
.swiper-button-prev1 {
  left: 40px;
}
.swiper-button-next1 {
  right: 40px;
}
.swiper-button-disabled {
  color: #ccc;
}
/* swiper 左右箭头样式结束 */

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
.amap-icon img {
  width: 58px !important;
  height: 70px !important;
}
</style>
