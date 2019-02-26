<template>
  <div class="noticeInfo">
    <basicHeader :desName="msg"></basicHeader>
    <div class="info">
      <img :src="imgUrl[i]" alt v-for="(v,i) in imgUrl" :key="i">
    </div>
  </div>
</template>

<script>
import basicHeader from "@/components/basicHeader"; //通用头部组件
import apis from "@/apis/index.js";
export default {
  name: "noticeInfo",
  data() {
    return {
      msg: "通知详情",
      id: null,
      imgUrl: null
    };
  },
  mounted() {
    this.msg = this.$route.query.title;
    this.id = this.$route.query.id;
    this.getInfo();
  },
  methods: {
    getInfo() {
      var self = this;
      apis.ggjt_info(this.id, function(res) {
        // console.log(res.data);
        self.imgUrl = res.data.result.imgUrls;
      });
    }
  },
  components: {
    basicHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noticeInfo .info {
  position: absolute;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;
}
.noticeInfo .info img {
  width: 100%;
}
</style>
