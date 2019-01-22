<template>
  <div class="home">
    <search></search>
    <mapComponent class="mapComponent" :dataFLag="true"></mapComponent>
  </div>
</template>

<script>
import search from "@/components/search"; //搜索框
import history from "@/components/history"; //历史记录框
import mapComponent from "@/components/mapComponent"; //首页地图组件
export default {
  name: "home",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
    search: search,
    mapComponent: mapComponent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
.mapComponent.amap-geolocation-con,
.mapComponent .amap-toolbar {
  bottom: 47px !important;
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
