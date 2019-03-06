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
            <p>{{v.sname}}</p>
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
  name: "busLineMapPreview",
  data() {
    return {
      msg: "公交线路站台点标记",
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
      styleObject: {},
      busLines: [],
      stepIndex: 0, //按步执行的索引,
      steps: [], //步骤数组,
      activeMark: null
    };
  },
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: "公交线路详情",
      lname: this.$route.query.lname,
      lguid: this.$route.query.lguid,
      focusIndex: this.$route.query.focusIndex
    };
    this.stepIndex = Number(this.options.focusIndex);
    this.getSteps();
  },
  methods: {
    // 获取详情步骤
    getSteps() {
      var self = this;
      var params = {
        lguids: this.options.lguid,
        includeStation: true
      };
      apis.findChannelBySguids(params, function(res) {
        self.steps = res.data.records[0].station;
        self.addMark();
        self.drawBusLines();
        self.drawActiveMark();
      });
    },
    //绘制点标记
    addMark() {
      var self = this;
      var markArr = [];
      this.steps.forEach((v, i) => {
        var markIcon = new AMap.Icon({
          // 图标的取图地址
          image: "./static/images/dot1x.png",
          // 图标尺寸
          size: new AMap.Size(12, 12)
          // 选用的图片尺寸
        });
        var marker = new AMap.Marker({
          position: new AMap.LngLat(v.lon, v.lat),
          offset: new AMap.Pixel(-6, -6),
          icon: markIcon,
          zoom: 13,
          map: this.map,
          zIndex: 10
        });
        markArr.push(marker);
      });
      this.$refs.mapObj.map.add(markArr);
      this.swiper.slideTo(this.stepIndex, 0, function() {
        self.drawActiveMark();
      });
      this.$refs.mapObj.map.setFitView();
    },
    // 绘制公交路线
    drawBusLines() {
      var busPath = [];
      this.steps.forEach((v, i) => {
        busPath.push([v.lon, v.lat]);
      });
      var busLine = new AMap.Polyline({
        path: busPath,
        isOutline: true,
        outlineColor: "white",
        strokeColor: "#37cabe", //线颜色
        strokeOpacity: 0.8, //线透明度
        lineJoin: "round",
        strokeWeight: 6, //线宽
        zIndex: 9
      });
      this.$refs.mapObj.map.add(busLine);
      this.$refs.mapObj.map.setFitView();
    },
    // 绘制焦点状态下的标记
    drawActiveMark() {
      if (this.activeMark) {
        this.$refs.mapObj.map.remove(this.activeMark);
      }
      var markIcon = new AMap.Icon({
        // 图标的取图地址
        image: "./static/images/location.png",
        // 图标尺寸
        size: new AMap.Size(48, 48)
        // 选用的图片尺寸
      });
      this.activeMark = new AMap.Marker({
        position: new AMap.LngLat(
          this.steps[this.stepIndex].lon,
          this.steps[this.stepIndex].lat
        ),
        offset: new AMap.Pixel(-24, -24),
        icon: markIcon,
        zoom: 13,
        zIndex: 11
      });
      this.$refs.mapObj.map.add(this.activeMark);
      this.$refs.mapObj.map.setFitView();
    },

    slideChangeTransitionEnd() {
      this.stepIndex = this.swiper.activeIndex;
      this.drawActiveMark();
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
.stepItem p {
  font-size: 38px !important;
  color: #000 !important;
  line-height: 38px !important;
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
.busMap-preivew .amap-icon img {
  /* width: 24px !important;
  height: 24px !important; */
  width: 100% !important;
  height: 100% !important;
}
</style>
