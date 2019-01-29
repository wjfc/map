<template>
  <div class="road" id="road">
    <header>
      <div class="destation">
        <div class="backArrow icon-wj_ic_back" @click="goBack()"></div>
        <span>{{options.name}}</span>
      </div>
      <ul class="strategy">
        <li
          :class="{'focus':i===typeIndex}"
          v-for="(item,i) in strategy"
          :key="i"
          @click="getRoutes(i)"
        >{{item.name}}</li>
      </ul>
    </header>

    <div class="routes">
      <div v-for="(v,i) in transits" :key="i" @click="goBusMap(i)" class="listbox">
        <basicList :v="v"></basicList>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";
import basicList from "@/components/basicList";
export default {
  name: "roadInfo",
  data() {
    return {
      msg: "路线详情",
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
    this.getRoutes(this.typeIndex);
  },
  components: {
    basicList
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
      this.typeIndex = i;
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
    // 点击跳转到公交地图页面
    goBusMap(i) {
      var self = this;
      this.$router.push({
        path: "/busMap",
        query: {
          name: encodeURI(this.options.name),
          address: encodeURI(this.options.address),
          location: this.options.location,
          id: this.options.id,
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
.routes .listbox {
  width: 100%;
  height: 250px;
  padding: 44px 0;
  box-sizing: border-box;
}
</style>
