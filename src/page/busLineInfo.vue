<template>
  <div class="busLines-info">
    <transcode class="transCode"></transcode>
    <div class="buslines-header">
      <basicHeader :desName="msg"></basicHeader>
      <div class="buslines-swiper" v-show="busList.length>0">
        <swiper
          :options="swiperOption"
          ref="mySwiper"
          @slideChangeTransitionEnd="slideChangeTransitionEnd"
        >
          <!-- slides -->
          <swiper-slide v-for="(v,i) in busList" :key="i">
            <div class="listbox">
              <div class="list-item">
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
              </div>
              <div class="mapPreview">
                <mapPreview></mapPreview>
              </div>
            </div>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";
import basicHeader from "@/components/basicHeader"; //通用头部组件
import basicList from "@/components/basicList";
import mapPreview from "@/components/mapPreview";
import transcode from "@/components/transCode";
import { swiper, swiperSlide } from "vue-awesome-swiper"; //swiper轮播效果
export default {
  name: "busLines_info",
  data() {
    return {
      msg: "",
      options: {},
      activeIndex: 0,
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        pagination: {
          el: ".swiper-pagination"
        },
        activeIndex: 0
      },
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
    this.msg = this.options.name;
    this.activeIndex = this.options.focusIndex;
    this.getBusList();
  },
  methods: {
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
        self.swiper.slideTo(self.activeIndex, 0, function() {});
      });
    },
    slideChangeTransitionEnd() {
      this.activeIndex = this.swiper.activeIndex;
    }
  },
  components: {
    basicHeader,
    swiper,
    swiperSlide,
    basicList,
    mapPreview,
    transcode
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.transCode {
  position: fixed;
  right: 40px;
  bottom: 127px;
  z-index: 1001;
}
/* 轮播图部分样式 */
.buslines-header {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #37cabe;
}
.buslines-swiper {
  position: absolute;
  top: 108px;
  left: 50%;
  transform: translate(-50%);
  width: 690px;
  height: 250px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}
.mapPreview {
  position: absolute;
  top: 84px;
  /* right: 8px; */
  left: 485px;
  width: 190px;
  height: 107px;
}
.list-item {
  max-width: 500px;
  padding-left: 32px;
  padding-top: 49px;
  box-sizing: border-box;
}
.direction {
  margin-bottom: 38px;
}
.direction span {
  font-size: 36px;
  color: #000;
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
/* 轮播图部分样式end */
</style>
