<template>
  <div class="busMap">
    <basicHeader :desName="options.name"></basicHeader>
    <mapComponent class="mapComponent2" ref="mapObj" :dataFLag="false"></mapComponent>
    <div class="busmap-bottom">
      <ul class="line-list">
        <li
          v-for="(v,i) in transits"
          :key="i"
          :class="{'focus':focusIndex === i}"
          @click="switchItem(i)"
        >
          <p>{{v.duration|formatTime}}</p>
          <p>{{v.distance|formatDistance}}</p>
        </li>
      </ul>
      <div class="line-info">
        <ul :style="styleObject">
          <li v-for="(v,i) in transits" :key="i">
            <div class="info-l">
              <div class="bus" id="bus-normal" v-html="formatBus(v.segments)"></div>
              <p>步行{{v.walking_distance}}m</p>
            </div>
            <div class="info-r" @click="goBusDetail(i)">
              <img src="../../static/images/infoBg.png" alt>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";
import basicHeader from "@/components/basicHeader"; //通用头部组件
import mapComponent from "@/components/mapComponent"; //地图组件
export default {
  name: "busMap",
  data() {
    return {
      msg: "bus地图",
      options: {},
      origin: "", //七点
      destination: "", //终点
      focusIndex: 0,
      styleObject: {},
      walkLines: [],
      busLines: [],
      transits: [] //高德返回路线数组
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
      focusIndex: this.$route.query.focusIndex
    };
    this.focusIndex = Number(this.$route.query.focusIndex);
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
      this.styleObject = {
        width: arr.length * 100 + "%"
      };
      this.drawStartAndEnd(); //绘制起点和终点
      this.drawbusLine(arr[this.focusIndex]);
      this.switchItem(this.focusIndex);
    },
    switchItem(i) {
      // 动画效果
      this.focusIndex = i;
      var transformLeft = -(i / this.transits.length) * 100 + "%";
      this.styleObject = {
        width: this.transits.length * 100 + "%",
        transform: "translate3d(" + transformLeft + ", 0, 0)"
      };
      // 动画效果
      this.drawbusLine(this.transits[i]); //画线
    },
    // 添加点方法
    addMark(location) {
      var self = this;
      var endIcon = new AMap.Icon({
        size: new AMap.Size(29, 35), // 图标尺寸
        image: ".static/images/mark0.png", // Icon的图像
        imageSize: new AMap.Size(29, 35) // 根据所设置的大小拉伸或压缩图片
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(
          location.split(",")[0],
          location.split(",")[1]
        ),
        offset: new AMap.Pixel(-15, -18),
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
      // var startPosition = new AMap.Marker({
      //   map: this.$refs.mapObj.map,
      //   position: [this.origin.split(",")[0], this.origin.split(",")[1]], //基点位置
      //   icon: "./static/images/startIcon.png",
      //   zIndex: 10
      // });
      // // 绘制终点
      // var endPosition = new AMap.Marker({
      //   map: this.$refs.mapObj.map,
      //   position: [
      //     this.destination.split(",")[0],
      //     this.destination.split(",")[1]
      //   ], //基点位置
      //   icon: "./static/images/endIcon.png",
      //   zIndex: 10
      // });
      // this.$refs.mapObj.map.setFitView();
      var startIcon = new AMap.Icon({
        size: new AMap.Size(29, 35), // 图标尺寸
        image: "./static/images/startIcon.png", // Icon的图像
        imageSize: new AMap.Size(29, 35) // 根据所设置的大小拉伸或压缩图片
      });
      var startMarker = new AMap.Marker({
        position: new AMap.LngLat(
          this.origin.split(",")[0],
          this.origin.split(",")[1]
        ),
        offset: new AMap.Pixel(-15, -18),
        icon: startIcon,
        zoom: 13
      });
      var endIcon = new AMap.Icon({
        size: new AMap.Size(29, 35), // 图标尺寸
        image: "./static/images/endIcon.png", // Icon的图像
        imageSize: new AMap.Size(29, 35) // 根据所设置的大小拉伸或压缩图片
      });
      var endMarker = new AMap.Marker({
        position: new AMap.LngLat(
          this.destination.split(",")[0],
          this.destination.split(",")[1]
        ),
        offset: new AMap.Pixel(-15, -18),
        icon: endIcon,
        zoom: 13
      });
      this.$refs.mapObj.map.add([startMarker, endMarker]);
      this.$refs.mapObj.map.setFitView();
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
            self.$refs.mapObj.map.setFitView([walkLine]);
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
          self.$refs.mapObj.map.setFitView([busLine]);
        }
        self.$refs.mapObj.map.setFitView();
      });
    },
    //格式化公交换乘方案
    formatBus(v) {
      var segments = v;
      var len = segments.length;
      var str = "";
      segments.forEach((ele, i) => {
        if (ele.bus.buslines.length > 0) {
          var index = ele.bus.buslines[0].name.indexOf("(");
          name =
            index > -1
              ? ele.bus.buslines[0].name.substr(0, index)
              : ele.bus.buslines[0].name;
          var span =
            i == len - 1
              ? "<span>" + name + "</span>"
              : "<span>" + name + "</span><i class='icon-wj_ic_diraction'></i>";
          str += span;
        }
      });
      return str;
    },
    // 跳转到公交导航详情页面
    goBusDetail(i) {
      this.$router.push({
        path: "/busDetail",
        query: {
          name: encodeURI(this.options.name),
          address: encodeURI(this.options.address),
          location: this.options.location,
          id: this.options.id,
          type: this.options.type,
          focusIndex: this.focusIndex
        }
      });
    }
  },
  computed: {},
  components: {
    basicHeader: basicHeader,
    mapComponent: mapComponent
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
/* 底部样式 */
.busmap-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 248px;
  background: #fff;
}
.line-list {
  display: flex;
  width: 100%;
  height: 40%;
  background-color: #f2f2f2;
}
.line-list li {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 20%;
  height: 100%;
  font-size: 22px;
  padding: 20px 0;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}
.line-list li.focus {
  color: #37cabe;
  background-color: #fff;
}
.line-list li.focus::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 100%;
  height: 6px;
  background-color: #37cabe;
}
.line-list li p {
  width: 100%;
  line-height: 22px;
}

.line-info {
  width: 100%;
  height: 60%;
  overflow: hidden;
}
.line-info ul {
  display: flex;
  height: 100%;
  width: 500%;
  transform: translate3d(0, 0px, 0px);
  transition: transform 0.3s ease-out 0s;
}
.line-info ul li {
  position: relative;
  flex: 1;
  height: 100%;
  padding: 0 12px;
  box-sizing: border-box;
}
.info-l {
  margin-top: 28px;
  margin-left: 28px;
  max-width: 67%;
}
.info-l p {
  margin-top: 19px;
  font-size: 26px;
  color: #888;
}
.info-r {
  position: absolute;
  right: 16px;
  top: 35px;
}
.info-r img {
  width: 190px;
  height: 107px;
}
/* 底部样式结束 */

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
  /* width: 58px !important;
  height: 70px !important; */
}
</style>
