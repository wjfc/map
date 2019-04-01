<template>
  <div class="noticeInfo">
    <basicHeader :desName="msg"></basicHeader>
    <div class="info" v-if="hackReset">
      <div v-for="(v,i) in imgUrl" :key="i">
        <img :src="imgUrl[i]" alt class="itemimg">
      </div>
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
      hackReset: true,
      imgUrl: []
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
      var result;
      apis.ggjt_info(this.id, function(res) {
        // console.log(res.data);
        result = res.data.result.imgUrls;
        self.imgUrl = result;
        self.$nextTick(() => {
          self.hackReset = true;
        });
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
.noticeInfo .info .itemimg {
  display: block;
  width: 100%;
}
</style>
