<template>
  <div class="busDetail">
    <transcode class="transCode"></transcode>
    <div class="busDetail-header">
      <basicHeader :desName="msg"></basicHeader>
      <div class="bus-swiper" v-show="transits.length>0">
        <swiper
          :options="swiperOption"
          ref="mySwiper"
          @slideChangeTransitionEnd="slideChangeTransitionEnd"
        >
          <!-- slides -->
          <swiper-slide v-for="(v,i) in transits" :key="i">
            <div class="listbox">
              <div class="mapPreview">
                <mapPreview @click.native="goBusMapPreview('','start')"></mapPreview>
              </div>
              <basicList :v="v"></basicList>
            </div>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <div class="busDetail-content">
      <div class="busDetail-list" v-for="(v,i) in mysegments" :key="i">
        <div class="section">
          <div class="walking">
            <div
              v-html="startName(v,i)"
              v-if="startName(v,i)"
              class="myposition leftIcon green"
              @click="goBusMapPreview('','start')"
            ></div>
            <!-- 步行距离 -->
            <div
              class="walking-distance baseline dashed"
              v-if="v.walking"
              @click="goBusMapPreview(i,'walking')"
            >
              <span class="icon-wj_ic_onfoot"></span>
              <span>{{v|formatDistance}}</span>
            </div>
            <!-- 步行距离 -->
          </div>
          <div
            class="busline baseline solid"
            v-if="departure_stop(v,i)"
            @click="goBusMapPreview(i,'busline')"
          >
            <!-- 公交车起点 -->
            <div
              class="bus-departure_stop leftIcon"
              :class="{'green':showSame(v,i)==='上车','transform':showSame(v,i)!=='上车'}"
            >
              <span>{{departure_stop(v,i)}}</span>
              <span>{{showSame(v,i)}}</span>
            </div>

            <!-- 公交车车辆停靠点 -->
            <div class="bus-via_stops" v-if="departure_stop(v,i)">
              <!-- 车辆到站信息 -->
              <div class="bus-time">
                <h3>{{v.buslines[0].name}}</h3>
                <div class="nearestBus">
                  <span>最近一辆</span>
                  <span>1</span>
                  <span>站到达</span>
                </div>
                <div class="timeline">首班车 05:20 末班 19:20</div>
              </div>
              <!-- 车辆到站信息结束 -->
              <!-- 站总数 -->
              <div
                class="bus-stopsNums"
                :class="{'showFlag':showFlags[i]}"
                @click.stop="transformFlag(i)"
              >
                <p>{{v.buslines[0].via_stops.length+2}}站</p>
                <i class="icon-wj_ic_down"></i>
              </div>

              <div v-show="showFlags[i]" class="allStopsList">
                <!-- 所有站列表 需要和公交接口数据对接，不能匹配的用高德，能匹配的用公交数据-->
                <!-- 上车站 -->
                <div class="departure_stop">
                  {{v.buslines[0].departure_stop.name}}
                  <span>上车</span>
                </div>
                <!-- 中间停靠站 -->
                <div
                  class="via_stop"
                  v-for="(stop,j) in v.buslines[0].via_stops"
                  :key="j"
                >{{stop.name}}</div>
                <!-- 下车站 -->
                <div class="arrival_stop">
                  {{v.buslines[0].arrival_stop.name}}
                  <span>下车</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 目的地 -->
      <div
        class="detanceline baseline solid"
        v-show="transits.length>0"
        @click="goBusMapPreview('','end')"
      >
        <div class="bustDetail-destance leftIcon red">{{options.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";
import basicHeader from "@/components/basicHeader"; //通用头部组件
import basicList from "@/components/basicList";
import mapPreview from "@/components/mapPreview";
import transcode from "@/components/transCode";
import { swiper, swiperSlide } from "vue-awesome-swiper"; //swiper轮播效果

export default {
  name: "busDetail",
  data() {
    return {
      msg: "换乘方案",
      options: {},
      activeIndex: 0,
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        pagination: {
          el: ".swiper-pagination"
        },
        activeIndex: 0
      },
      transits: [], //高德返回路线数组
      segments: [], //方案详情
      mysegments: [], //处理后的方案详情
      showFlags: [] // 自定义数组用来保存 上下箭头状态。是否是列表展开状态
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
    this.destination = this.$route.query.location; //终点

    this.activeIndex = this.options.focusIndex;
    this.getRoutes(this.options.type);
  },
  methods: {
    getRoutes(type) {
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
        strategy: type
      };
      apis.getRoutesInfo(params, function(res) {
        self.transits = res.data.route.transits;
        // swiper 滑动到指定位置。
        self.swiper.slideTo(self.activeIndex, 0, function() {});
        self.getMysegments();
      });
    },
    slideChangeTransitionEnd() {
      this.activeIndex = this.swiper.activeIndex;
      this.getMysegments();
    },
    getMysegments() {
      // 处理高德导航返回的数据。
      var showFlag = [];
      var mysegments = [];
      var segments = this.transits[this.activeIndex].segments;
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
        showFlag.push(false);
        mysegments.push(obj);
      });
      this.showFlags = showFlag;
      this.mysegments = mysegments;
    },
    // 第一步判断
    startName(v, i) {
      // 都是先步行后公交，如果公交起点终点一致，则不展示步行而已。
      // 获取数组开始位置名称,判断是否是第一个，第一个展示 我的位置。 其余的展示公交起点（条件是这个步骤里必须包含公交路线）。
      /**
       * 1、换乘时候，只画起点，不画终点。如果下一个起点和当前的终点一致，则展示同站换乘，不去做步行路线；否则的话，显示起点名称。
       * 2、到最后一步的时候，再画终点。
       */
      if (i == 0) {
        return "我的位置";
      } else if (i > 0) {
        return null;
      }
    },
    // 获取公交起点名称,如果没有公交车列表则返回false
    departure_stop(v, i) {
      if ("buslines" in v) {
        return v.buslines[0].departure_stop.name;
      } else {
        return false;
      }
    },
    // 是否展示同站换乘
    showSame(v, i) {
      if (i == 0) {
        return "上车";
      }
      var s =
        v.buslines[0].departure_stop.name ==
        this.mysegments[i - 1].buslines[0].arrival_stop.name
          ? "同站换乘"
          : "上车";
      return s;
    },
    // 切换箭头展示列表
    transformFlag(i) {
      this.$set(this.showFlags, i, !this.showFlags[i]);
    },
    // 跳转到公交地图预览详情页面
    goBusMapPreview(i, point) {
      // i，当前索引；point，起点,步行，公交，终点;

      var self = this;
      this.$router.push({
        path: "/busMapPreview",
        query: {
          name: encodeURI(this.options.name),
          address: encodeURI(this.options.address),
          location: this.options.location,
          id: this.options.id,
          type: this.options.type,
          activeIndex: this.activeIndex,
          index: i,
          point: point
        }
      });
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  watch: {},
  components: {
    basicHeader,
    swiper,
    swiperSlide,
    basicList,
    mapPreview,
    transcode
  },
  filters: {
    formatDistance(v) {
      if (v.walking) {
        return "步行" + v.walking.distance + "m";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.transCode {
  position: fixed;
  right: 40px;
  bottom: 127px;
  z-index: 1001;
}
.busDetail-header {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #37cabe;
}
.bus-swiper {
  position: absolute;
  top: 108px;
  left: 50%;
  transform: translate(-50%);
  width: 690px;
  height: 250px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}

.listbox {
  position: relative;
  width: 100%;
  height: 250px;
  padding: 44px 0;
  padding-left: 29px;
  box-sizing: border-box;
}
.mapPreview {
  position: absolute;
  top: 84px;
  /* right: 8px; */
  left: 485px;
  width: 190px;
  height: 107px;
}
/* 详情 */
.busDetail-content {
  position: absolute;
  top: 448px;
  width: 100%;
  background-color: #fff;
}
.busDetail-list {
  width: 100%;
}
.busDetail-list .section {
  position: relative;
  width: 100%;
}
.busDetail-list .walking {
}
.walking .myposition {
  font-size: 30px;
  font-weight: bold;
  box-sizing: border-box;
  padding-left: 132px;
}
.walking-distance {
  position: relative;
  display: flex;
  padding: 50px 0;
  box-sizing: border-box;
  padding-left: 132px;
}

.walking-distance span:first-child {
  margin-right: 20px;
  color: #37cabe;
  font-size: 40px;
}
.walking-distance span:last-child {
  font-size: 26px;
  color: #999;
}

/* 最近的车辆信息 */
.bus-time {
  width: 100%;
  padding-top: 30px;
  padding-bottom: 30px;
}
.bus-time .timeline {
  font-size: 24px;
  color: #999;
  font-weight: normal;
}
.bus-time h3 {
  color: #37cabe;
  font-size: 30px;
}
.bus-time .nearestBus {
  font-size: 26px;
  color: #999;
}
.bus-time .nearestBus span {
  margin: 0;
}
.bus-time .nearestBus span:nth-child(2) {
  color: #37cabe;
}
/* 最近的车辆信息结束 */
.bus-departure_stop {
  width: 100%;
  height: 88px;
  line-height: 88px;
  box-sizing: border-box;
  padding-left: 132px;
}
.bus-departure_stop span:first-child {
  font-size: 30px;
  color: #212121;
  font-weight: bold;
  margin-right: 20px;
}
.bus-departure_stop span:last-child {
  font-size: 24px;
  color: #999;
  font-weight: bold;
}
/* 中间停靠站 */
.allStopsList {
  padding-bottom: 30px;
}
.bus-via_stops {
  position: relative;
  box-sizing: border-box;
  padding-left: 132px;
  background-color: #e3f2f1;
}
.bus-via_stops .bus-stopsNums {
  display: flex;
  align-items: center;
  position: absolute;
  top: 75px;
  right: 30px;
  font-size: 28px;
  color: #666;
}
.bus-via_stops .bus-stopsNums.showFlag i {
  transform: rotate(180deg);
}
.bus-via_stops .bus-stopsNums i {
  margin-left: 15px;
  transform: rotate(0);
}
.bus-via_stops div {
  color: #022121;
  font-size: 26px;
  font-weight: bold;
  line-height: 44px;
}
.bus-via_stops div span {
  margin-left: 5px;
  font-size: 24px;
  color: #999999;
  font-weight: 500;
}
/* 详情 */
/* 目的地 */
.bustDetail-destance {
  box-sizing: border-box;
  padding-left: 132px;
  font-size: 30px;
  padding-top: 30px;
  padding-bottom: 30px;
  color: #212121;
  font-weight: bold;
}
/* 左边图标样式 */
.leftIcon {
  position: relative;
}
.leftIcon::before {
  position: absolute;
  left: 82px;
  top: 50%;
  transform: translateY(-50%);
  content: "";
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  z-index: 1000;
}
.leftIcon.red::before {
  border: 4px solid #fd3232;
}
.leftIcon.green::before {
  border: 4px solid #37cabe;
}
.leftIcon.transform::before {
  content: "";
  left: 72px;
  width: 44px;
  height: 44px;
  background: url("../../static/images/transfrom.png") no-repeat;
  background-size: 100% 100%;
}
/* 目的地 */

/* 最左边线条样式 */
.baseline {
  position: relative;
}
.baseline::before {
  content: "";
  position: absolute;
  left: 94px;
  top: 0;
  height: 100%;
  z-index: 999;
}
.baseline.dashed::before {
  border: 2px dashed #37cabe;
}

.baseline.solid::before {
  /* border: 2px solid #37cabe; */
  width: 4px;
  background: #37cabe;
}
.baseline.detanceline::before {
  height: 50%;
}
/* 最左边线条样式 */
</style>
