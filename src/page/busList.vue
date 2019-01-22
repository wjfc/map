<template>
  <div class="road" id="road">
    <header>
      <div class="destation">
        <div class="backArrow icon-wj_ic_back" @click="goBack()"></div>
        <span>{{options.name}}</span>
      </div>
      <ul class="strategy">
        <li
          :class="{'focus':i===focusIndex}"
          v-for="(item,i) in strategy"
          :key="i"
          @click="getRoutes(i)"
        >{{item.name}}</li>
      </ul>
    </header>

    <ul class="routes">
      <li class="routeItem" v-for="(v,i) in transits" :key="i">
        <div class="durations">
          <span>{{v.duration|formatTime}}</span>
          <span>步行{{v.walking_distance}}m</span>
        </div>
        <div class="bus" id="bus-normal" v-html="formatBus(v.segments)"></div>
        <div class="info">
          <span>{{v.segments|formatStations}}</span>
          <span>.</span>
          <span>{{v.cost}}元</span>
          <span>.</span>
          <span>{{v.segments|formatDeparture_stop}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";

export default {
  name: "roadInfo",
  data() {
    return {
      msg: "路线详情",
      options: {},
      focusIndex: 0,
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
      transits: [] //高德返回路线数组
    };
  },
  mounted() {
    this.options = {
      name: decodeURI(this.$route.query.name),
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location,
      id: this.$route.query.id
    };
    this.getRoutes(this.focusIndex);
  },
  methods: {
    getRoutes(i) {
      var self = this;
      if (!this.$store.state.location_now) {
        var origin = localStorage.getItem("location_now");
      } else {
        var origin = this.$store.state.location_now;
      }
      var params = {
        origin: origin, //当前位置定位
        destination: this.options.location, //目的地位置定位
        key: baseConstant.key,
        city: baseConstant.adname,
        strategy: this.strategy[i].type
      };
      this.focusIndex = i;
      apis.getRoutesInfo(params, function(res) {
        self.showRoutes(res.data.route.transits);
      });
    },
    showRoutes(arr) {
      this.transits = arr;
    },
    goBack() {
      this.$router.back();
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
    }
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
    // 格式化总站数量
    formatStations(v) {
      var segments = v;
      var stations = 0;
      segments.forEach((ele, i) => {
        if (ele.bus.buslines.length > 0) {
          stations = stations + (parseInt(ele.bus.buslines[0].via_num) + 2);
        }
      });
      return stations + "站";
    },
    // 起点站
    formatDeparture_stop(v) {
      var segments = v;
      return segments[0].bus.buslines[0].departure_stop.name + "上车";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.road {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
.road .backArrow {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  font-size: 42px;
}
.strategy {
  display: flex;
  margin: 0 auto;
  margin-top: 14px;
  width: 720px;
  height: 58px;
  border: 1px solid rgba(55, 202, 190, 1);
  border-radius: 10px;
  box-sizing: border-box;
}
.strategy li {
  flex: 1;
  text-align: center;
  line-height: 58px;
  font-size: 28px;
  color: #37cabe;
  border-right: 1px solid #37cabe;
  box-sizing: border-box;
}
.strategy li:first-child {
  border-radius: 10px 0 0 10px;
}
.strategy li:last-child {
  border: none;
  border-radius: 0 10px 10px 0;
}
.strategy li.focus {
  color: #fff;
  background-color: #37cabe;
}
.routes {
  /* margin-top: 18px; */
  position: absolute;
  top: 176px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 30px;
  width: 100%;
  box-sizing: border-box;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.routes li {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  padding: 49px 0;
  box-sizing: border-box;
}
.routes li .durations {
}
.routes li .durations span:first-child {
  font-size: 36px;
  color: #212121;
  font-weight: bold;
  margin-right: 20px;
}
.routes li .durations span:last-child {
  font-size: 28px;
  font-weight: 400;
  color: #888888;
}
.routes li .bus {
  margin-top: 23px;
  margin-bottom: 19px;
}
.routes li .bus span {
  display: inline-block;
  font-size: 28px;
  line-height: 28px;
  color: #212121;
  padding: 12px 22px;
  box-sizing: border-box;
  border: 2px solid rgba(33, 33, 33, 1);
  border-radius: 8px;
}
.routes li .bus i:last-child {
  display: none;
}
.routes li .info {
  font-size: 26px;
  color: #888888;
}
.routes li .info span:last-child {
  color: #37cabe;
}
</style>
