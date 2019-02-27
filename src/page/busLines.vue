<template>
  <div class="buslines">
    <basicHeader :desName="options.name"></basicHeader>
    <div class="mapPreview">
      <mapPreview @click.native="goBusMapPreview()"></mapPreview>
    </div>
    <ul class="buslineBox">
      <li class="buslineItem" v-for="(v,i) in busList" :key="i" @click="goBusLinesInfo(i)">
        <h3>{{options.name}}</h3>
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
          <div>
            <span>.</span>
            <span>票价{{v.station[0].price}}元</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import basicHeader from "@/components/basicHeader"; //通用头部组件
import mapPreview from "@/components/mapPreview";
import baseConstant from "@/constant/index.js";
import apis from "@/apis/index.js";
export default {
  name: "buslines",
  data() {
    return {
      msg: "",
      options: {},
      busList: [] //公交车双向列表
    };
  },
  mounted() {
    this.options = {
      name: this.$route.query.lname + "路",
      lname: this.$route.query.lname,
      lguid: this.$route.query.lguid,
      isMain: this.$route.query.isMain
    };
    this.getBusList();
  },
  methods: {
    // 返回到地图首页？
    goBusMapPreview() {
      this.$router.push({
        path: "/"
      });
    },
    // 获取公交车列表
    getBusList() {
      var self = this;
      var params = {
        lname: this.options.lname,
        pageSize: 12,
        includeStation: true
      };
      apis.findChannelBySguids(params, function(res) {
        self.busList = res.data.records;
      });
    },
    goBusLinesInfo(i) {
      this.$router.push({
        path: "/busLineInfo",
        query: {
          name: this.options.lname + "路",
          lname: this.options.lname,
          lguid: this.options.lguid,
          isMain: this.options.isMain,
          focusIndex: i
        }
      });
    }
  },
  components: {
    basicHeader,
    mapPreview
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buslines {
  width: 100%;
}
.buslineBox {
  width: 100%;
  background: #fff;
}
.buslineItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;
  width: 100%;
  height: 252px;
  border-bottom: 2px solid #ededed;
  box-sizing: border-box;
}
.buslineItem h3 {
  font-size: 36px;
  color: #212121;
  font-weight: bold;
}
.direction {
  margin-top: 35px;
  margin-bottom: 30px;
}
.direction span {
  font-size: 28px;
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
.mapPreview {
  position: fixed;
  left: 567px;
  bottom: 115px;
}
</style>
