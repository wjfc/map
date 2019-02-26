<template>
  <div class="routeItem">
    <div class="durations">
      <span>{{this.v.duration|formatTime}}</span>
      <span>步行{{this.v.walking_distance}}m</span>
    </div>
    <div class="bus" id="bus-normal" v-html="formatBus(this.v.segments)"></div>
    <div class="info">
      <!-- <span>{{this.v.segments|formatStations}}</span> -->
      <span>{{v.totalStations}}站</span>
      <span>.</span>
      <span>{{this.v.cost}}元</span>
      <span>.</span>
      <span>{{this.v.segments|formatDeparture_stop}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "basicList",
  data() {
    return {
      msg: "通用列表"
    };
  },
  props: ["v", "activeIndex", "mysegment"],
  mounted() {},
  methods: {
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
.routeItem {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.routeItem .durations {
  height: 34px;
}
.routeItem .durations span {
  display: inline-block;
  line-height: 34px;
}
.routeItem .durations span:first-child {
  font-size: 34px;
  color: #212121;
  font-weight: bold;
  margin-right: 20px;
}
.routeItem .durations span:last-child {
  font-size: 28px;
  font-weight: 400;
  color: #888888;
}
.routeItem .bus {
  /* margin-top: 23px;
  margin-bottom: 19px; */
}
.routeItem .bus span {
  display: inline-block;
  font-size: 28px;
  line-height: 28px;
  color: #212121;
  padding: 12px 22px;
  border: 2px solid rgba(33, 33, 33, 1);
  border-radius: 8px;
  box-sizing: border-box;
}
.routeItem .bus i:last-child {
  display: none;
}
.routeItem .info {
  height: 25px;
  font-size: 25px;
  color: #888888;
}
.routeItem .info span {
  display: inline-block;
  line-height: 25px;
}
.routeItem .info span:last-child {
  color: #37cabe;
}
</style>
