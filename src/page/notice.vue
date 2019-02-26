<template>
  <div class="notice">
    <basicHeader :desName="msg"></basicHeader>
    <div class="noticeLists">
      <div class="noticeItem" v-for="(v,i) in noticeList" :key="i">
        <router-link :to="{path:'noticeInfo',query:{id:v.id,title:v.title}}">
          <div class="notice-header" :class="{first:i==0}">{{v.pubTime}}</div>
          <div class="notice-content">
            <h3>{{v.title}}</h3>
          </div>
        </router-link>
      </div>
    </div>
    <div class="infinite-wrapper">
      <infinite-loading @infinite="infiniteHandler">
        <div slot="no-more" class="nomore">没有更多了...</div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import basicHeader from "@/components/basicHeader"; //通用头部组件
import InfiniteLoading from "vue-infinite-loading"; //vue上拉加载插件
import axios from "axios";
import apis from "@/apis/index.js";
export default {
  name: "notice",
  data() {
    return {
      msg: "通知",
      noticeList: [], //通知列表
      pageSize: 10,
      pageNum: 1,
      page: 1
    };
  },
  mounted() {},
  methods: {
    infiniteHandler($state) {
      axios
        .get("/ggjt/list", {
          params: {
            pageIndex: this.page,
            pageSize: this.pageSize
          }
        })
        .then(({ data }) => {
          if (data.result.list.length) {
            this.page += 1;
            this.noticeList.push(...data.result.list);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    }
  },
  components: {
    basicHeader,
    InfiniteLoading
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notice {
  background-color: #fff;
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
  z-index: 98;
  background-color: #d7d7d7;
}
.noticeItem:last-child::before {
  display: none;
}
.noticeItem {
  position: relative;
  padding-bottom: 60px;
  box-sizing: border-box;
}
.noticeItem:last-child {
  padding-bottom: 10px;
}
.notice-header {
  position: relative;
  font-size: 20px;
  color: #999;
  margin-bottom: 10px;
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
  box-sizing: border-box;
  width: 558px;
  border-radius: 16px;
  background: #fff;
}
.notice-content h3 {
  font-size: 32px;
  margin-bottom: 30px;
  line-height: 1.5;
  font-weight: normal;
  color: #212121;
}
.notice-content p {
  font-weight: 400;
  color: #999;
}
.nomore {
  font-size: 24px;
}
</style>
