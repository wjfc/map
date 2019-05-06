<template>
  <div class="road" id="road">
    <mapComponent class="mapComponent2" ref="mapObj" :dataFLag="false"></mapComponent>
    <header>
      <div class="destation">
        <div class="backArrow icon-wj_ic_back" @click="goBack()"></div>
        <p>{{options.title}}</p>
        <img src="../../static/images/home2.png" alt @click="home()">
      </div>
      <div class="searchRoutes">
        <div class="startInput inputBox">
          <i class="icon-coordinate"></i>
          <input
            type="text"
            placeholder="输入起点"
            v-model.trim="searchStart"
            @input="submitSearch(0)"
            @focus="inputFocus(0)"
          >
        </div>
        <div class="endInput inputBox">
          <i class="icon-coordinate"></i>
          <input
            type="text"
            placeholder="输入终点"
            v-model.trim="searchEnd"
            @input="submitSearch(1)"
            @focus="inputFocus(1)"
          >
        </div>
        <div class="switchDirection" @click="switchDirection"></div>
      </div>
      <ul class="strategy" v-show="!showSearchResult">
        <li
          :class="{'focus':i===typeIndex}"
          v-for="(item,i) in strategy"
          :key="i"
          @click="getRoutes(i)"
        >{{item.name}}</li>
      </ul>
    </header>
    <ul class="searchLists" v-if="showSearchResult">
      <li class="listItem" v-for="(v,i) in searchResultList" :key="i">
        <p @click="fillInput(v,i)">{{v.name}}</p>
      </li>
    </ul>
    <div class="routesBox">
      <div class="routes" v-show="!showSearchResult">
        <div v-for="(v,i) in transits" :key="i" @click="goBusMap(i)" class="listbox">
          <basicList :v="v"></basicList>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div class="loading" v-show="showLoading">
      <p>{{loadingText}}</p>
      <div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <!-- 提示起点和终点一样 -->
    <div class="sameDirection" v-show="showSameDirection">{{showSameText}}</div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import { mapMutations } from "vuex";
import mapComponent from "@/components/mapComponent"; //地图组件
import baseConstant from "@/constant/index.js";
import basicList from "@/components/basicList";
export default {
  name: "busList",
  data() {
    return {
      msg: "路线详情",
      showLoading: false,
      loadingText: "重新获取定位中...",
      showSameDirection: false,
      showSameText: "起点和终点不能相同",
      showSameDirectionTimer: null,
      options: {},
      typeIndex: 0,
      strategy: [
        {
          name: "推荐",
          type: 1
        },
        {
          name: "步行少",
          type: 3
        },
        {
          name: "少换乘",
          type: 2
        },
        {
          name: "不坐地铁",
          type: 5
        }
      ],
      transits: [], //高德返回路线数组
      currentLocation: "",
      origin: {}, //起点定位信息
      destination: {}, //终点定位信息
      searchType: 0, //0或者1,记为起点或者终点
      searchStorage: null, //搜索历史记录
      searchStart: "", //起点双向数据绑定
      searchEnd: "", //终点双向数据绑定
      showSearchResult: false, //显示搜索结果，默认为false
      searchResultList: [] //搜索结果列表
    };
  },
  mounted() {
    this.options = {
      name: decodeURI(this.$route.query.name),
      title: "线路推荐",
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location
    };
    // 处理搜索记录只显示地点，不显示公交线路
    var searchHistory = localStorage.getItem("searchStorage");
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      this.searchStorage = searchHistory.filter(function(v) {
        return v.id != "wjgj";
      });
      this.searchStorage.unshift({
        name: "我的位置"
      });
      this.searchStart = "我的位置";
      this.searchEnd = this.options.name;
    }
    if (!this.$store.state.location_now) {
      var origin = localStorage.getItem("location_now");
    } else {
      var origin = this.$store.state.location_now;
    }
    this.origin = {
      name: "我的位置",
      location: origin
    };
    this.destination = {
      name: this.searchEnd,
      location: this.options.location
    };
    this.getRoutes(this.typeIndex);
  },
  components: {
    basicList,
    mapComponent
  },
  methods: {
    ...mapMutations(["changeNowLocation"]),
    getRoutes(i) {
      var self = this;
      this.showLoading = true;
      this.loadingText = "正在努力加载中...";
      this.showSearchResult = false;

      var params = {
        origin: this.origin.location, //起点位置定位
        destination: this.destination.location, //终点位置定位
        key: baseConstant.key,
        city: baseConstant.adname,
        strategy: this.strategy[i].type
      };
      this.typeIndex = i;
      apis.getRoutesInfo(params, function(res) {
        self.showRoutes(res.data.route.transits);
        self.showLoading = false;
      });
    },
    submitSearch(type) {
      // type 为0是搜索的起点，type为1搜索的是终点

      this.showSearchResult = true;
      this.searchType = type;
      var keywords = type == 0 ? this.searchStart : this.searchEnd;
      var self = this;
      // 高德搜索接口
      var params = {
        key: baseConstant.key,
        keywords: keywords,
        city: baseConstant.adcode,
        citylimit: true,
        // 15000:交通相关  19000:地名相关
        type: "15000|"
      };
      apis.searchByKeyword(params, function(res) {
        var result = [];
        if (!res.data) {
          this.searchResultList = [];
          return false;
        } else {
          var tips = res.data.tips;
          tips.forEach((v, i) => {
            // v.adcode == "320509" &&
            if (v.location.length > 0) {
              result.push(v);
            }
          });
          result.unshift({
            name: "我的位置"
          });
          self.searchResultList = result;
        }
      });
    },
    // 输入框获得焦点时间
    inputFocus(type) {
      // type 为0是搜索的起点，type为1搜索的是终点
      // 输入框内容为空时，展示历史记录。
      this.searchType = type;
      if (
        type == 0 &&
        this.searchStart == "" &&
        this.searchResultList.length < 1
      ) {
        this.searchResultList = this.searchStorage;
        this.showSearchResult = true;
      } else if (
        type == 1 &&
        this.searchEnd == "" &&
        this.searchResultList.length < 1
      ) {
        this.searchResultList = this.searchStorage;
        this.showSearchResult = true;
      }
    },
    // 点击列表，将点击内容填充到输入框中
    fillInput(v, i) {
      /**需判断起点或者终点，以及是否是列表中中的第一个，定位是异步的所以需要特殊处理。
       * 1.1 如果是起点，并且点击的是列表中的第一个，开始调用高德地图定位功能，并更新我的位置定位地点。
       * 1.2 如果是终点，并且点击的是列表中的第一个，开始调用高德地图定位功能，并更新我的位置定位地点。
       */

      switch (i) {
        case 0:
          if (this.searchType == 0 && this.searchEnd == "我的位置") {
            this.searchStart = "";
            this.dealSameDirection();
            return false;
          } else if (this.searchType == 1 && this.searchStart == "我的位置") {
            this.searchEnd = "";
            this.dealSameDirection();
            return false;
          }
          this.showLoading = true;
          this.loadingText = "重新获取定位中...";
          this.getCurrentLocation(v, i);
          break;
        default:
          if (this.searchType == 0) {
            this.origin = v;
            this.searchStart = v.name;
          } else {
            this.destination = v;
            this.searchEnd = v.name;
          }
          if (this.searchStart != "" && this.searchEnd != "") {
            this.checkSame();
          }
          break;
      }
    },

    // 获取当前位置信息
    getCurrentLocation() {
      var self = this;
      AMap.plugin(["AMap.Geolocation"], function() {
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
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        geolocation.getCurrentPosition(); // 调用高德定位方法。
        AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
        AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        function onComplete(data) {
          // 需要保存位置信息
          var posX = data.position.getLng();
          var poxY = data.position.getLat();
          self.currentLocation = posX + "," + poxY;
          // self.currentLocation = "120.638966" + "," + "31.151753";

          if (self.searchType == 0) {
            // 起点
            self.origin = {
              name: "我的位置",
              location: self.currentLocation
            };
            self.searchStart = self.origin.name;
          } else {
            self.destination = {
              name: "我的位置",
              location: self.currentLocation
            };
            self.searchStart = self.destination.name;
          }
          self.showLoading = false;
          // 调用路线规划
          if (this.searchEnd != "" && this.searchStart != "") {
            self.getRoutes(self.typeIndex);
            self.showSearchResult = false;
          }
        }
        function onError(data) {
          console.log(data);
        }
      });
    },
    // 核实起点终点位置,是否一样
    checkSame() {
      if (this.searchType == 0 && this.searchEnd == this.searchStart) {
        this.dealSameDirection();
        this.searchStart = "";
      } else if (this.searchType == 1 && this.searchEnd == this.searchStart) {
        this.dealSameDirection();
        this.searchEnd = "";
      } else {
        this.showSearchResult = false;
        // 调用路线规划
        this.getRoutes(this.typeIndex);
      }
    },
    dealSameDirection() {
      // 方向一致时，展示方向不能一致。
      var self = this;
      this.showSameText = "起点和终点不能相同";
      this.showSameDirection = true;

      if (this.showSameDirectionTimer) {
        clearTimeout(this.showSameDirectionTimer);
      }
      this.showSameDirectionTimer = setTimeout(() => {
        self.showSameDirection = false;
      }, 2500);
    },
    // 调换方向

    switchDirection() {
      var tempObj = null;
      tempObj = this.origin;
      this.origin = this.destination;
      this.destination = tempObj;
      this.searchStart = this.origin.name;
      this.searchEnd = this.destination.name;
      this.getRoutes(this.typeIndex);
      // 调用路线规划
    },
    showRoutes(arr) {
      this.transits = arr;
    },
    goBack() {
      this.$router.back();
    },
    home() {
      this.$router.push({
        path: "/"
      });
    },
    // 点击跳转到公交地图页面
    goBusMap(i) {
      var self = this;
      this.$router.push({
        path: "/busMap",
        query: {
          name: encodeURI(this.origin.name),
          address: encodeURI(this.destination.name),
          origin: this.origin.location, //起始位置
          location: this.destination.location, //目的地
          type: this.strategy[this.typeIndex].type,
          focusIndex: i
        }
      });
    }
  },

  filters: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 加载中 */
.loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.loading p {
  width: 100%;
  position: absolute;
  top: 640px;
  text-align: center;
  font-size: 36x;
  color: #fff;
  opacity: 0.8;
}
.loadEffect {
  position: absolute;
  left: 50%;
  top: 500px;
  transform: translate(-50%);
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.loadEffect span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0fc899;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(1.2);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(0.3);
    opacity: 0.5;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -10px;
  -webkit-animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  -webkit-animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -10px;
  -webkit-animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  -webkit-animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -10px;
  -webkit-animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  -webkit-animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -10px;
  -webkit-animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  -webkit-animation-delay: 1.04s;
}

/* 加载中 */
.road {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fcfcfc;
}
.road header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  z-index: 999;
}
.road header div.destation {
  position: relative;
  width: 100%;
  height: 88px;
  text-align: center;
  line-height: 88px;
  font-size: 36px;
  background: #37cabe;
}
.road header div.destation p {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 600px;
  height: 88px;
  text-align: center;
  line-height: 88px;
  font-size: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.road header div.destation img {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translate(0, -50%);
  width: 40px;
  height: 40px;
}
.road .backArrow {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  font-size: 42px;
}

/* 输入起点终点 */
.searchRoutes {
  position: relative;
  width: 100%;
  height: 170px;
  padding-top: 21px;
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
  background: #fff;
}
.searchRoutes .inputBox {
  position: relative;
  height: 64px;
  line-height: 64px;
  background: #fcfcfc;
}

.searchRoutes .inputBox input {
  display: block;
  margin-left: 76px;
  width: 540px;
  height: 100%;
  font-size: 28px;
  border: 0;
  background: none;
  outline: none;
  box-sizing: border-box;
}

.searchRoutes .inputBox:nth-child(2)::before {
  content: "";
  position: absolute;
  left: 76px;
  top: 0;
  width: 540px;
  height: 2px;
  background: #ccc;
  z-index: 999;
}
.searchRoutes .inputBox i {
  position: absolute;
  top: 50%;
  left: 32px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #0fc899;
  border-radius: 100%;
}
.searchRoutes .inputBox:nth-child(2) i {
  background: #ff0000;
}
.switchDirection {
  position: absolute;
  right: 45px;
  top: 50%;
  z-index: 9;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: url("../../static/images/switch.png") no-repeat;
  background-size: 100% 100%;
}
/*  输入起点终点结束 */
/* 搜索记录列表 */
.searchLists {
  display: block;
  position: absolute;
  top: 277px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
}
.searchLists .listItem:first-child {
  font-weight: bold;
}
.searchLists .listItem {
  width: 100%;
  line-height: 80px;
  height: 80px;
  font-size: 30px;
  color: #000;
  background: #fff;
}
.searchLists .listItem p {
  width: 690px;
  height: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
}
.searchLists .listItem:hover {
  cursor: pointer;
}
/* 搜索记录列表结束 */
.strategy {
  display: flex;
  margin: 0 auto;
  margin-top: 14px;
  width: 720px;
  height: 58px;
  box-sizing: border-box;
}
.strategy li {
  width: 25%;
  text-align: center;
  line-height: 58px;
  font-size: 28px;
  color: #37cabe;
  /* border-right: 2px solid #37cabe; */
  border: 2px solid #37cabe;
  border-right: 0px solid #37cabe;
  box-sizing: border-box;
}
.strategy li:first-child {
  border-radius: 10px 0 0 10px;
}
.strategy li:last-child {
  /* border: none; */
  border-radius: 0 10px 10px 0;
  border-right: 2px solid #37cabe;
}
.strategy li.focus {
  color: #fff;
  background-color: #37cabe;
}

/* 路线详情 */
.routesBox {
  position: absolute;
  top: 346px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 15px;
  box-sizing: border-box;
  background: #eee;
}
.routes {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.routes .listbox {
  width: 100%;
  height: 250px;
  padding: 44px 15px;
  box-sizing: border-box;
  margin-top: 15px;
  background: #fff;
  border-radius: 6px;
}
.routes .listbox:last-child {
  margin-bottom: 15px;
}
/* 路线详情结束 */
/* 谷歌改变光标颜色 */
input {
  color: #333;
  caret-color: #999;
}
/* ios改变光标颜色 */
@supports (-webkit-mask: none) and (not (caret-color: #999)) {
  input {
    color: #999;
  }
  input::first-line {
    color: #333;
  }
}
.mapComponent2 {
  display: none;
}
.sameDirection {
  position: fixed;
  padding: 10px 20px;
  height: 60px;
  line-height: 60px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 160px;
  border-radius: 10px;
  font-size: 28px;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
</style>
