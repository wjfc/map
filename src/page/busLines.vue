<template>
  <div class="buslines">
    <basicHeader :desName="msg"></basicHeader>
    <div class="mapPreview">
      <mapPreview @click.native="goBusMapPreview()"></mapPreview>
    </div>
    <ul class="buslineBox">
      <li class="buslineItem">
        <h3>162路</h3>
        <div class="direction">
          <span>珠江路</span>
          <i class="icon-wj_ic_diraction"></i>
          <span>儿童医院</span>
        </div>
        <div class="bustimes">
          <div>
            <img src="../../static/images/start.png" alt>
            <span>05:00</span>
          </div>
          <div>
            <img src="../../static/images/end.png" alt>
            <span>23:00</span>
          </div>
          <div>
            <span>.</span>
            <span>票价2元</span>
          </div>
        </div>
      </li>
      <li class="buslineItem">
        <h3>162路</h3>
        <div class="direction">
          <span>珠江路</span>
          <i class="icon-wj_ic_diraction"></i>
          <span>儿童医院</span>
        </div>
        <div class="bustimes">
          <div>
            <img src="../../static/images/start.png" alt>
            <span>05:00</span>
          </div>
          <div>
            <img src="../../static/images/end.png" alt>
            <span>23:00</span>
          </div>
          <div>
            <span>.</span>
            <span>票价2元</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import basicHeader from "@/components/basicHeader"; //通用头部组件
import mapPreview from "@/components/mapPreview";
export default {
  name: "buslines",
  data() {
    return {
      msg: "",
      noticeList: [] //通知列表
    };
  },
  mounted() {
    this.msg = "162路";
  },
  methods: {
    goBusMapPreview() {}
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
  position: absolute;
  left: 567px;
  bottom: 127px;
}
</style>
