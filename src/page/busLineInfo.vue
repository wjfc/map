<template>
  <div class="busLines-info">
    <transcode class="transCode"></transcode>
    <div class="buslines-header">
      <basicHeader :desName="msg"></basicHeader>
      <div class="buslines-swiper" v-show="busList.length>0">
        <swiper
          :options="swiperOption"
          ref="mySwiper"
          @slideChangeTransitionEnd="slideChangeTransitionEnd"
        >
          <!-- slides -->
          <swiper-slide v-for="(v,i) in busList" :key="i">
            <div class="listbox">
              <div class="list-item">
                <div class="direction">
                  <span>{{v.station[0].sname}}</span>
                  <i class="icon-wj_ic_diraction"></i>
                  <span>{{v.station[v.station.length-1].sname}}</span>
                </div>
                <div class="bustimes">
                  <div>
                    <img src="../../static/images/start.png" alt>
                    <span>{{v.lfstdftime}}</span>
                  </div>
                  <div>
                    <img src="../../static/images/end.png" alt>
                    <span>{{v.lfstdetime}}</span>
                  </div>
                  <div v-if="v.station[0].price">
                    <span>.</span>
                    <span>票价{{v.station[0].price}}元</span>
                  </div>
                </div>
              </div>
              <div class="mapPreview" @click="goBusLineMapPreview(0)">
                <mapPreview></mapPreview>
              </div>
              <div class="yubao" @click="callAlarme">
                <img src="../../static/images/yubao.png" alt>
              </div>
            </div>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <div class="buslines-content">
      <ul>
        <li
          v-for="(v,i) in stationList"
          :key="i"
          :class="{hasBusIcon:v.busIcon,active:statinonIndex === i}"
          @click="stationFocus(v,i)"
        >
          <p :class="{active:statinonIndex === i}">{{v.sname}}</p>
        </li>
      </ul>
    </div>
    <div class="buslines-totast-mask" v-show="totastMaskShow">
      <div class="buslines-totast">
        <p>{{totastContent}}</p>
        <div @click="closeTotastMaskShow">知道了</div>
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
import utils from "@/utils/index.js";
import $ from "jquery";
import { swiper, swiperSlide } from "vue-awesome-swiper"; //swiper轮播效果
export default {
  name: "busLineInfo",
  data() {
    return {
      userid: null,
      msg: "",
      code: "",
      options: {},
      activeIndex: 0,
      yubaoTimer: null,
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        pagination: {
          el: ".swiper-pagination"
        },

        activeIndex: 0
      },
      busList: [], //公交车双向列表
      stationList: [], //站的列表
      statinonIndex: null, //点击车站列表的元素的索引
      showMessageNum: null, //展示距离选择的车站最近的车辆位置
      totastMaskShow: false,
      totastContent: "",
      findBusInfo_timer: null, //开始定时器找寻线路上的所有车辆
      busLastSlon: [] //线路上所有公交车停靠的站台位置索引
    };
  },
  mounted() {
    this.userid = localStorage.getItem("smUserId");

    this.options = {
      name: this.$route.query.lname + "路",
      lname: this.$route.query.lname,
      lguid: this.$route.query.lguid,
      isMain: this.$route.query.isMain,
      focusIndex: this.$route.query.focusIndex
    };

    this.msg = this.options.name;
    if (this.options.focusIndex) {
      this.activeIndex = Number(this.options.focusIndex);
    } else {
      this.activeIndex = null;
    }

    this.getBusList();
  },
  updated() {},
  methods: {
    // 获取公交车列表
    getBusList() {
      var self = this;
      var params = {
        lname: this.options.lname,
        includeStation: true
      };
      apis.findChannelBySguids(params, function(res) {
        self.busList = res.data.records;
        self.busList = self.busList.filter(v => {
          return v.lname == params.lname;
        });
        if (!self.activeIndex) {
          self.busList.forEach((v, i) => {
            if (self.options.lguid == v.lguid) {
              self.activeIndex = i;
              return;
            }
          });
        }
        self.getStationList();
        self.swiper.slideTo(self.activeIndex, 0, function() {});
      });
    },
    // 获取站台列表
    getStationList() {
      var self = this;
      this.stationList = this.busList[this.activeIndex].station;
      this.statinonIndex = null;
      this.stationList.forEach((v, i) => {
        v.busIcon = false;
      });
      this.findBusInfo();
      if (this.findBusInfo_timer) {
        clearInterval(this.findBusInfo_timer);
        this.findBusInfo_timer = null;
      }
      this.findBusInfo_timer = setInterval(() => {
        self.findBusInfo();
      }, 10000);
    },
    //
    // 跳转到公交线路地图详情页面
    goBusLineMapPreview(i) {
      this.$router.push({
        path: "/busLineMapPreview",
        query: {
          lname: this.options.lname,
          lguid: this.busList[this.activeIndex].lguid,
          focusIndex: i
        }
      });
    },
    // 获取线路公交详情
    findBusInfo() {
      var self = this;
      var busLastSlon = [];
      var new_stationList = self.stationList;
      var params = {
        lguids: this.busList[this.activeIndex].lguid
      };
      this.stationList.forEach((v, i) => {
        v.busIcon = false;
      });
      apis.findBusInfo(params, ({ data }) => {
        var records = data.records;
        records.forEach((v, i) => {
          busLastSlon.push(v.lastSlno);
          self.$set(self.stationList[v.lastSlno - 1], "busIcon", true);
        });
        this.busLastSlon = busLastSlon;
        self.$forceUpdate();
      });
    },
    slideChangeTransitionEnd() {
      this.activeIndex = this.swiper.activeIndex;
      this.getStationList();
    },
    // 点击站台获得焦点状态
    stationFocus(v, i) {
      this.statinonIndex = i;

      var slno = v.slno;
      var lastArr = [];
      this.busLastSlon.forEach((v, i) => {
        if (v <= slno) {
          lastArr.push(slno - v);
        }
      });
      if (lastArr.length > 0) {
        this.showMessageNum = Math.min.apply(null, lastArr);
      } else {
        this.showMessageNum = null;
      }
      // this.showTotast();
    },
    // 展示模态框
    showTotast() {
      // console.log(this.showMessageNum);
      if (this.showMessageNum > 0) {
        this.totastContent =
          "距离您选中的车站，最近的车辆还有" + this.showMessageNum + "站到达。";
      } else if (this.showMessageNum == 0) {
        this.totastContent = "车辆已经过本站，请抓紧时间乘车！";
      } else {
        this.totastContent = "暂未查询到发站的车辆！";
      }

      this.totastMaskShow = true;
    },
    closeTotastMaskShow() {
      this.totastMaskShow = false;
    },
    sendMessage() {
      if (!this.statinonIndex) {
        this.totastContent = "请先选择一个车站添加到报站工作台！";
        this.totastMaskShow = true;
      } else {
        // 添加定时器预报
        var slno = this.stationList[this.statinonIndex].slno;
        var self = this;
        if (this.yubaoTimer) {
          clearInterval(this.yubaoTimer);
          this.yubaoTimer = null;
        } else {
          this.yubaoTimer = setInterval(function() {
            var lastArr = [];
            self.busLastSlon.forEach((v, i) => {
              if (v <= slno) {
                lastArr.push(slno - v);
              }
            });
            if (lastArr.length > 0) {
              var yubaoNum = Math.min.apply(null, lastArr);
              if (yubaoNum > 0 && yubaoNum <= 2) {
                var obj = {
                  title: "公交通知",
                  text: "公交即将到站，请尽快赶到车站乘车！",
                  toUserId: this.userid || "406451624106001384"
                };
                apis.sendMsg2(obj, function(res) {
                  self.totastContent = "添加报站成功，请注意查询！";
                  self.totastMaskShow = true;
                  clearInterval(self.yubaoTimer);
                  self.yubaoTimer = null;
                });
              } else if (yubaoNum == 0) {
                var obj = {
                  title: "公交通知",
                  text: "公交已经到站了，请注意抓紧时间乘车！",
                  toUserId: this.userid || "406451624106001384"
                };
                apis.sendMsg2(obj, function(res) {
                  self.totastContent = "添加报站成功，请注意查询！";
                  self.totastMaskShow = true;
                  clearInterval(self.yubaoTimer);
                  self.yubaoTimer = null;
                });
              }
            }
          }, 1000);
        }
      }
    },
    callAlarme() {
      // ?lguid=0000000000LINELINEINFO16092021904440&destIndex=21&forecastNumber=2&userId=406451624106001384
      if (!this.statinonIndex) {
        this.totastContent = "请先选择一个车站添加到报站工作台！";
        this.totastMaskShow = true;
      } else {
        var slno = this.stationList[this.statinonIndex].slno;
        var lguid = this.stationList[this.statinonIndex].lguid;
        var self = this;
        var lastArr = [];
        self.busLastSlon.forEach((v, i) => {
          if (v <= slno) {
            lastArr.push(slno - v);
          }
        });
        if (lastArr.length > 0) {
          var yubaoNum = Math.min.apply(null, lastArr);
          if (yubaoNum > 0 && yubaoNum <= 1) {
            self.totastContent = "车辆即将到达本站！";
            self.totastMaskShow = true;
          } else {
            var params = {
              lguid: lguid,
              destIndex: slno,
              forecastNumber: 2,
              userId: this.userid
            };
            apis.callBusWarn(params, function(res) {
              if (res.data.message == "success") {
                self.totastContent = "设置成功！";
                self.totastMaskShow = true;
              }
            });
          }
        }
      }
    }
  },
  components: {
    basicHeader,
    swiper,
    swiperSlide,
    basicList,
    mapPreview,
    transcode
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
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
/* 轮播图部分样式 */
.buslines-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 250px;
  background-color: #37cabe;
}
.buslines-swiper {
  position: fixed;
  z-index: 999999;
  top: 108px;
  left: 50%;
  transform: translate(-50%);
  width: 690px;
  height: 250px;
  background: #fff;
  box-shadow: 0px 5px 20px 0px #ccc;
  border-radius: 16px;
}
.mapPreview {
  position: absolute;
  top: 49px;
  /* right: 8px; */
  left: 480px;
  width: 190px;
  height: 107px;
}
.yubao {
  position: absolute;
  left: 480px;
  top: 131px;
  width: 190px;
  height: 107px;
}
.yubao img {
  width: 100%;
  height: 100%;
}
.list-item {
  position: relative;
  z-index: 9999;
  max-width: 500px;
  padding-left: 40px;
  padding-top: 49px;
  box-sizing: border-box;
}
.direction {
  margin-bottom: 38px;
}
.direction span {
  font-size: 32px;
  color: #000;
}
.bustimes {
  display: flex;
  align-items: center;
  font-size: 26px;
  color: #999;
}
.bustimes > div {
  margin-right: 20px;
}
.bustimes img {
  width: 28px;
  height: 28px;
  vertical-align: bottom;
}
/* 轮播图部分样式end */
/* 站点展示部分 */
.buslines-content {
  position: absolute;
  width: 100%;
  padding-left: 92px;
  top: 448px;
  box-sizing: border-box;
  background-color: #fff;
}

.buslines-content li {
  position: relative;
  padding-left: 39px;
  height: 90px;
  line-height: 90px;
}

.buslines-content li::before {
  position: absolute;
  top: 50%;
  left: -16px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 1);
  border: 4px solid rgba(15, 200, 153, 1);
  border-radius: 50%;
  content: "";
  z-index: 999;
}
.buslines-content li::after {
  position: absolute;
  top: 0;
  left: 0px;
  content: "";
  width: 4px;
  height: 100%;
  background: #37cabe;
  z-index: 1;
}

.buslines-content li.hasBusIcon::before {
  position: absolute;
  left: -33px;
  top: 50%;
  transform: translateY(-50%);
  width: 66px;
  height: 66px;
  background: url("../../static/images/busIconNew.png") no-repeat;
  background-size: 100% 100%;
  border: 0px solid rgba(15, 200, 153, 1) !important;
  content: "";
  z-index: 999;
}
.buslines-content li.active::before {
  position: absolute;
  left: -22px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: url("../../static/images/locationIcon.png") no-repeat;
  background-size: 100% 100%;
  border: 0px solid rgba(15, 200, 153, 1) !important;
  content: "";
  z-index: 999;
}
.buslines-content li:last-child::before {
  border: 4px solid #fd3232;
}
.buslines-content li:first-child:after {
  top: 50%;
  height: 50%;
}
.buslines-content li:last-child:after {
  height: 50%;
}

.buslines-content li p {
  font-weight: bold;
  font-size: 30px;
  color: #212121;
}
.buslines-content li p.active {
  color: #f86c51;
}
/* 站点展示部分end */
/* 弹窗部分 */
.buslines-totast-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.buslines-totast {
  position: fixed;
  z-index: 5000;
  width: 80%;
  max-width: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  text-align: center;
  border-radius: 6px;
  overflow: hidden;
}
.buslines-totast p {
  padding: 50px 40px;
  font-size: 30px;
  line-height: 1.3;
  border-bottom: 2px solid #f2f2f2;
}
.buslines-totast div {
  font-size: 32px;
  line-height: 96px;
  color: rgba(15, 200, 153, 1);
}
/* 弹窗结束 */
</style>
