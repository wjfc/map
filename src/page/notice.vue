<template>
  <div class="notice">
    <basicHeader :desName="msg"></basicHeader>
    <div class="noticeLists">
      <div class="noticeItem">
        <div class="notice-header first">30分钟前</div>
        <div class="notice-content">
          <h3>152线路调整</h3>
          <p>152路由于万寿停车场施工现在已经调整至太龙路下车，请各位市民提前绕道！</p>
        </div>
      </div>
      <div class="noticeItem">
        <div class="notice-header">30分钟前</div>
        <div class="notice-content">
          <h3>152线路调整</h3>
          <p>152路由于万寿停车场施工现在已经调整至太龙路下车，请各位市民提前绕道！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import basicHeader from "@/components/basicHeader"; //通用头部组件
export default {
  name: "notice",
  data() {
    return {
      msg: "通知",
      noticeList: [] //通知列表
    };
  },
  mounted() {},
  methods: {},
  components: {
    basicHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notice {
  background-color: #f2f2f2;
  min-height: 100%;
}
.noticeLists {
  width: 100%;
  padding-left: 152px;
  padding-right: 40px;
  padding-top: 92px;
  box-sizing: border-box;
}
.noticeItem::before {
  position: absolute;
  left: -38px;
  content: "";
  width: 4px;
  height: 100%;
  background: #d7d7d7;
  z-index: 98;
}
.noticeItem:last-child::before {
  display: none;
}
.noticeItem {
  position: relative;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.notice-header {
  position: relative;
  font-size: 24px;
  color: #212121;
  margin-bottom: 25px;
}
.notice-header::before {
  width: 24px;
  height: 24px;
  position: absolute;
  left: -54px;
  content: "";
  border: 4px solid #d7d7d7;
  border-radius: 50%;
  background-color: #fff;
  z-index: 99;
}
.notice-header.first::before {
  border: 4px solid #ef0707;
}
.notice-content {
  padding: 30px;
  box-sizing: border-box;
  width: 558px;
  height: 214px;
  border-radius: 16px;
  background: #fff;
}
.notice-content h3 {
  font-size: 36px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #212121;
}
.notice-content p {
  font-weight: 400;
  color: #999;
}
</style>
