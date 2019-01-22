<template>
  <div class="destation">
    <header>
      <div class="backArrow icon-wj_ic_back" @click="goBack()"></div>
      <p>{{options.name}}</p>
    </header>
    <mapComponent class="mapComponent2" ref="mapObj" :dataFLag="false"></mapComponent>
  </div>
</template>

<script>
import mapComponent from "@/components/mapComponent"; //地图组件
export default {
  name: "destaion",
  data() {
    return {
      msg: "bus地图",
      options: {}
    };
  },
  created() {},
  mounted() {
    var self = this;
    this.options = {
      name: decodeURI(this.$route.query.name),
      address: decodeURI(this.$route.query.address),
      location: this.$route.query.location,
      id: this.$route.query.id
    };
    setTimeout(function() {
      self.$refs.mapObj.addMark(self.$route.query.location);
    }, 500);
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  },
  computed: {},
  components: {
    mapComponent: mapComponent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.destation {
  width: 100%;
  height: 100%;
}
.destation header {
  position: relative;
  width: 100%;
  height: 88px;
  background: #37cabe;
  color: #fff;
}
.destation header p {
  width: 100%;
  height: 88px;
  text-align: center;
  line-height: 88px;
  font-size: 36px;
}
.destation .backArrow {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  font-size: 42px;
}

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
