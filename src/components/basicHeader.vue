<template>
  <div class="basicHeader">
    <header>
      <div class="backArrow icon-wj_ic_back" @click="goBack()"></div>
      <p>{{desName}}</p>
    </header>
  </div>
</template>

<script>
import mapComponent from "@/components/mapComponent"; //地图组件
export default {
  name: "basicHeader",
  data() {
    return {
      msg: "头部通用导航"
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  },
  props: ["desName"]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.basicHeader {
  width: 100%;
}
.basicHeader header {
  position: relative;
  width: 100%;
  height: 88px;
  background: #37cabe;
  color: #fff;
}
.basicHeader header p {
  width: 100%;
  height: 88px;
  text-align: center;
  line-height: 88px;
  font-size: 36px;
}
.basicHeader .backArrow {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  font-size: 42px;
}
</style>
