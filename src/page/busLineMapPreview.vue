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
      activeShowLine: null //按步执行索引后当前展示的路线
    };
  },
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: "公交线路详情",
      lname: this.$route.query.lname,
      lguid: this.$route.query.lguid
    };
  },
  methods: {
    slideChangeTransitionEnd() {}
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
  margin-bottom: 20px;
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
