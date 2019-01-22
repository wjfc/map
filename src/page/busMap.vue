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
            <div class="info-r">
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
      focusIndex: 0,
      styleObject: {},
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
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: decodeURI(this.$route.query.name),
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location,
      id: this.$route.query.id,
      typeIndex: 0
    };
    this.getRoutes(this.options.typeIndex);
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
      apis.getRoutesInfo(params, function(res) {
        self.showRoutes(res.data.route.transits);
      });
    },
    showRoutes(arr) {
      this.transits = arr;
      this.styleObject = {
        width: arr.length * 100 + "%"
      };
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
</style>
