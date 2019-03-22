<template>
  <div class="home">
    <search ref="searchObj"></search>
    <mapComponent
      class="mapComponent"
      :class="{showChannel:showChannel&&!this.$refs.searchObj.showList}"
      :dataFLag="true"
      ref="mapObj"
      :dataFrom="dataFrom"
      @wjtran_search="searchStation"
    ></mapComponent>

    <div class="channel" v-show="showChannel&&!this.$refs.searchObj.showList">
      <div class="tips-l">
        <div class="stationName">{{stationInfo.name}}站</div>
        <div class="channels">{{stationInfo.channels}}</div>
      </div>
      <div class="tips-r" @click="getWalking()">
        <p class="icon-wj_ic_onfoot"></p>
        <p>去这里</p>
      </div>
    </div>
    <div class="newest" v-if="newestMessage">
      <div class="circle" :class="{noRead:noRead}" @click="goNotice(newestMessage.id)">
        <i class="icon-wj_ic_message"></i>
      </div>
      <div
        class="news-title"
        v-if="noRead"
        @click="goNotice(newestMessage.id)"
      >{{newestMessage.title}}</div>
    </div>
  </div>
</template>

<script>
import search from "@/components/search"; //搜索框
import history from "@/components/history"; //历史记录框
import mapComponent from "@/components/mapComponent"; //首页地图组件
import baseConstant from "@/constant/index.js";
import utils from "@/utils/index.js";
import apis from "@/apis/index.js";

export default {
  name: "home",
  data() {
    return {
      code: null,
      showFriend_tips: true,
      dataFrom: "home",
      showChannel: false,
      stationInfo: {}, //站台信息
      stationMark: [], //获取到的点标记数据
      stationIcon: [], //高德描点图标数组
      walkLine: null, //步行路线,
      origin: "", //起点
      destination: "", //终点
      newestMessage: null, //通知公告
      currentMarkIndex: 0, //当前点击状态的索引
      lastMarkIndex: 0, //上一个点击状态的索引
      noRead: true //判断没有读取过最新的资讯信息
    };
  },
  created() {},
  mounted() {
    this.code = window.location.search.substr(1).split("=")[1];
    var smcode = localStorage.getItem("smcode");
    if (this.code && this.code !== smcode) {
      localStorage.setItem("smcode", this.code);
    } else {
      this.code = smcode;
    }

    this.getUserid();
    this.ggjt_list();
  },
  methods: {
    searchStation() {
      var self = this;
      if (!this.$store.state.location_now) {
        var origin = localStorage.getItem("location_now");
      } else {
        var origin = this.$store.state.location_now;
      }
      this.origin = origin;
      var params = {
        lon: origin.split(",")[0],
        lat: origin.split(",")[1],
        range: 500
      };
      apis.searchStationByRange(params, function(res) {
        // 公交站一般是两个方向的。
        self.stationMark = res.data.record.slice(0, 10);
        self.drawStationMark();
        // 描点公交站
      });
    },
    // 绘制点，以及添加点击方法
    drawStationMark() {
      // 添加点标记前需要先清除点标记
      if (this.stationIcon.length > 0) {
        this.clearStationMark();
      }
      var self = this;
      this.stationMark.forEach((v, i) => {
        if (
          self.currentMarkIndex != self.lastMarkIndex &&
          i == self.currentMarkIndex
        ) {
          var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(29, 39),
            // 图标的取图地址
            image: "./static/images/red.png",
            // 根据所设置的大小拉伸或压缩图片
            imageSize: new AMap.Size(29, 39)
            // 图标取图偏移量
          });
        } else {
          var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(29, 39),
            // 图标的取图地址
            image: "./static/images/green.png",
            // 根据所设置的大小拉伸或压缩图片
            imageSize: new AMap.Size(29, 39)
          });
        }

        // 将 icon 传入 marker
        var startMarker = new AMap.Marker({
          position: new AMap.LngLat(
            this.stationMark[i].lon,
            this.stationMark[i].lat
          ),
          icon: startIcon,
          offset: new AMap.Pixel(-15, -20)
        });
        startMarker.index = i;
        startMarker.on("click", function(e) {
          var index = e.target.index; //点击图标的索引
          self.showChannel = true;
          // 调用获取公交路线接口
          var params = {
            sguids: self.stationMark[index].sguid
          };
          apis.findChannelBySguids(params, function(res) {
            self.lastMarkIndex = self.currentMarkIndex;
            self.currentMarkIndex = index;
            self.drawStationMark();
            self.showChannelInfo(res.data.records, index);
          });
        });
        self.stationIcon.push(startMarker);
      });
      this.$refs.mapObj.map.add(self.stationIcon);
      this.$refs.mapObj.map.setFitView(self.stationIcon);
    },
    // 清除点标记
    clearStationMark() {
      this.$refs.mapObj.map.remove(this.stationIcon);
      this.stationIcon = [];
    },

    // 显示线路详情
    showChannelInfo(data, index) {
      var self = this;
      var str = "";
      for (var i = 0; i < data.length; i++) {
        str += data[i].lname + "路" + ";";
      }
      self.stationInfo = {
        name: self.stationMark[index].sname,
        channels: str,
        dataIndex: index
      };
    },
    getWalking() {
      // 获取步行路线
      var self = this;
      // 显示步行导航路线
      var destination =
        this.stationMark[this.stationInfo.dataIndex].lon +
        "," +
        this.stationMark[this.stationInfo.dataIndex].lat;
      var params = {
        origin: this.origin,
        destination: destination,
        key: baseConstant.key
      };
      this.destination = destination;
      apis.getWalkingInfo(params, function(res) {
        self.drawWalkingPath(res.data);
        self.drawStartAndEnd();
      });
    },
    // 绘制步行路线
    drawWalkingPath(data) {
      if (this.walkLine) {
        this.clearWalkingPath();
      }
      var self = this;
      var steps = data.route.paths[0].steps;
      var walkPath = [];
      var pathStr = "";
      var walkLine;
      steps.forEach((v, i) => {
        pathStr += v.polyline + ";";
      });
      pathStr = pathStr.substr(0, pathStr.length - 1);
      var polylineArray = pathStr.split(";");
      walkPath.push([this.origin.split(",")[0], this.origin.split(",")[1]]);
      for (var k = 0; k < polylineArray.length; k++) {
        walkPath.push([
          polylineArray[k].split(",")[0],
          polylineArray[k].split(",")[1]
        ]);
      }
      walkPath.push([
        this.destination.split(",")[0],
        this.destination.split(",")[1]
      ]);
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
      this.walkLine = walkLine;
      self.$refs.mapObj.map.add(walkLine);
      self.$refs.mapObj.map.setFitView([walkLine]);
    },
    // 清除步行路线
    clearWalkingPath() {
      this.$refs.mapObj.map.remove(this.walkLine);
    },
    // 绘制起点和终点
    drawStartAndEnd() {
      // 绘制起点
      // 绘制终点
    },
    // 获取通知公告
    ggjt_list() {
      var self = this;
      apis.ggjt_list(
        {
          pageIndex: 1,
          pageSize: 1
        },
        function(res) {
          var newestId = localStorage.getItem("newestId") || null;
          self.newestMessage = res.data.result.list[0];
          if (newestId == self.newestMessage.id) {
            self.noRead = false;
          } else {
            self.noRead = true;
          }
        }
      );
    },
    goNotice(id) {
      // 跳转到通知列表页面
      localStorage.setItem("newestId", id);
      this.$router.push({
        path: "/notice"
      });
    },
    getUserid() {
      // 测试版先获取token，然后再去获取userid
      var self = this;
      var code = localStorage.getItem("smcode");
      var params = {
        client_id: baseConstant.smAppid,
        client_secret: baseConstant.smAppSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: baseConstant.redirect_uri
      };
      apis.getSmToken2(params, function(res) {
        if (res.access_token) {
          var params2 = {
            token: res.access_token
          };
          apis.getSmUserid2(params2, function(res2) {
            var res_temp = utils.getCorrectNum(res2);
            if (res_temp.userId) {
              localStorage.setItem("smUserId", res_temp.userId);
            } else {
              console.log("获取userId失败");
            }
          });
        } else {
          console.log("获取token失败");
        }
      });
    }
  },
  components: {
    search: search,
    mapComponent: mapComponent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* channel */
.channel {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  left: 30px;
  bottom: 40px;
  width: 690px;
  height: 208px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}
.tips-l {
  margin-left: 40px;
  width: 460px;
}
.stationName {
  font-size: 40px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
}
.channels {
  font-size: 26px;
  color: #999;
}
.tips-r {
  width: 128px;
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
/* channel结束 */
/* 通知公告样式 */
.newest {
  position: absolute;
  top: 134px;
  left: 50%;
  width: 690px;
  height: 64px;

  transform: translateX(-50%);
  background: transparent;
}
.newest .circle {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
}
.newest .circle::after {
  visibility: hidden;
  position: absolute;
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ff0000;
  right: 0;
  top: 0;
}
.newest .circle.noRead::after {
  visibility: visible;
}
.newest .circle .icon-wj_ic_message {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: #666;
}
.newest .news-title {
  text-align: center;
  letter-spacing: 2px;
  color: #37cabe;
  font-size: 28px;
  height: 64px;
  line-height: 64px;
  left: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #fff;
  border-radius: 32px;
  padding-left: 72px;
  box-sizing: border-box;
}
.newest .news-title.noRead {
  display: none;
}
/* 通知公告样式结束 */

/* 友情提示 */
.tips-firendly {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100000;
}
.tips-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 540px;
  height: 252px;
  background: #fff;
  border-radius: 20px;
  font-size: 30px;
}
.tips-box p:nth-child(1) {
  width: 100%;
  text-align: center;
  line-height: 164px;
  height: 164px;
  border-bottom: 1px solid #dddddd;
}
.tips-box p:nth-child(2) {
  width: 100%;
  text-align: center;
  line-height: 87px;
  height: 87px;
}
/* 友情提示结束 */

.mapComponent {
  position: absolute;
  top: 88px;
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
.mapComponent .amap-geolocation-con,
.mapComponent .amap-toolbar {
  bottom: 47px !important;
}
.mapComponent.showChannel .amap-geolocation-con,
.mapComponent.showChannel .amap-toolbar {
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

/* 更改左下角默认样式  */
</style>
