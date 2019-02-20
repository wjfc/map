<template>
  <div class="searchHeader">
    <div class="noSearchList" v-if="nosearch">
      <img src="../../static/images/nosearch.png" alt>
    </div>
    <div class="searchBox">
      <div class="searchIcon icon-wj_ic_search"></div>
      <form id="myform" action onsubmit="return false;">
        <input
          type="search"
          placeholder="请输入目的地或者公交线路"
          v-model.trim="searchContent"
          @input="submitSearch"
          @focus="inputFocus"
          @blur="inputBlur"
        >
      </form>
    </div>
    <button class="btn">搜索</button>
    <!-- 历史记录列表 -->
    <div class="historyList" v-if="historyList && historyList.length>0&&showList">
      <ul class="lists">
        <li class="listItem" v-for="(v,i) in historyList" :key="i" @click="goDestation(v)">
          <p>
            <span></span>
            <span>{{v.name}}</span>
          </p>
        </li>
      </ul>
      <div class="clear" @click="clearList()">{{clearMsg}}</div>
    </div>
    <!-- 历史记录列表结束 -->
  </div>
</template>

<script>
import apis from "@/apis/index.js";
import baseConstant from "@/constant/index.js";

export default {
  name: "searchInput",
  data() {
    return {
      msg: "头部搜索框",
      searchContent: "", //输入框内容绑定
      historyList: [], //展示的列表
      searchStorage: [], //保存在本地的历史记录
      clearMsg: "取消",
      showList: true, //展示列表flag,
      nosearch: false
    };
  },
  created() {
    var self = this;
  },
  mounted() {
    var searchHistory = localStorage.getItem("searchStorage");
    if (searchHistory) {
      this.searchStorage = JSON.parse(searchHistory);
    }
  },
  methods: {
    submitSearch(e) {
      //表单提交
      this.nosearch = false;
      var self = this;
      var params = {
        key: baseConstant.key,
        keywords: this.searchContent,
        city: baseConstant.adcode,
        citylimit: true,
        // 15000:交通相关  19000:地名相关
        type: "15000|"
      };
      apis.searchByKeyword(params, function(res) {
        /**
         * 1、需要做判断，如果输入的是汉字，调用高德的模糊搜索接口。
         * 2、如果输入的是数字，则调用吴江公交的接口。
         * 3、返回值也需要做判断。不同的返回值做不同的处理。
         */
        var historyList = [];
        var tips = res.data.tips;

        tips.forEach((v, i) => {
          // if (v.adcode == "320509") {
          //   historyList.push(v);
          // }
          historyList.push(v);
        });
        self.historyList = historyList;
        // console.log(res.data);
        self.clearMsg = "取消";
        if (res.data.tips.length < 1 && self.searchContent !== "") {
          // 显示未搜索到结果
          // self.nosearch = true;
        }
      });
    },
    // 输入框获得焦点逻辑
    inputFocus() {
      this.showList = true;
      if (this.searchContent == "") {
        // 输入框为空时，查询历史记录展示
        this.nosearch = false;
        this.historyList = this.searchStorage;
        this.clearMsg = "清空全部历史记录";
      }
    },
    // 输入框失去焦点逻辑
    inputBlur() {},
    goDestation(v) {
      // 本地存储中存在则删除原有的后添加；不存在则直接添加到本地存储。
      var insetIndex = this.uniqueList(v, this.searchStorage);
      if (insetIndex > -1) {
        this.searchStorage.splice(insetIndex, 1);
        this.searchStorage.unshift(v);
      } else {
        this.searchStorage.unshift(v);
      }
      localStorage.setItem("searchStorage", JSON.stringify(this.searchStorage));
      this.searchContent = v.name;
      // 跳转时需判断是否是poi类型数据
      if (v.id.indexOf("B") > -1) {
        // 有坐标跳转到目的地地图页面
        this.$router.push({
          path: "/destation",
          query: {
            name: encodeURI(v.name),
            address: encodeURI(v.address),
            location: v.location,
            id: v.id
          }
        });
      } else {
        // 跳转到线路页面
      }
    },
    clearList() {
      // 点击取消或者清空历史记录
      this.showList = false;
      if (this.clearMsg == "取消") {
      } else {
        this.searchStorage = [];
        localStorage.removeItem("searchStorage");
      }
    },
    // 数组去重
    uniqueList(v, arr) {
      var index = -1;
      for (var i = 0; i < arr.length; i++) {
        if (v.id === arr[i].id) {
          index = i;
        }
      }
      return index;
    }
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.searchHeader {
  position: relative;
  width: 100%;
  height: 88px;
  padding-top: 14px;
  background: #37cabe;
  box-sizing: border-box;
}
.noSearchList {
  position: absolute;
  width: 100%;
  height: 1256px;
  top: 88px;
  bottom: 0;
  background: #fff;
  z-index: 99999;
}
.noSearchList img {
  position: absolute;
  top: 288px;
  left: 50%;
  transform: translate(-50%);
  width: 280px;
  height: 280px;
}
.searchHeader .btn {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translate(0, -50%);
  height: 88px;
  line-height: 88px;
  font-size: 32px;
  font-weight: 400;
  color: #fff;
  background-color: transparent;
}
/* 设置padding-left 给搜索icon预留位置 */
.searchBox {
  display: flex;
  align-items: center;
  margin-left: 16px;
  width: 590px;
  height: 56px;
  border-radius: 56px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
}
.searchIcon {
  margin-left: 18px;
  font-size: 36px;
  color: #999;
}

#myform {
  position: relative;
  width: 624px;
  height: 100%;
}
.searchBox input {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  padding-left: 21px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 28px;
  border: 0;
  background: none;
  outline: none;
  font-family: PingFang-SC-Regular;
}
/* 谷歌改变光标颜色 */
input {
  color: #333;
  caret-color: #999;
}
/* ios改变光标颜色 */
@supports (-webkit-mask: none) and (not (caret-color: #999)) {
  input {
    color: #999;
  }
  input::first-line {
    color: #333;
  }
}
/* 历史记录样式 */
.historyList {
  display: block;
  position: absolute;
  top: 88px;
  width: 100%;
  max-height: 1194px;
  background: #fff;
  z-index: 999;
}
.lists {
  width: 100%;
}
.lists li {
  width: 100%;
  line-height: 80px;
  height: 80px;
  font-size: 30px;
  color: #000;
  background: #fff;
}
.lists li p {
  width: 690px;
  height: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #f5f5f5;
  box-sizing: border-box;
}
.lists li:hover {
  cursor: pointer;
}
.clear {
  width: 100%;
  height: 98px;
  line-height: 98px;
  font-size: 30px;
  text-align: center;
  color: #000;
}
/* 历史记录样式结束 */
</style>
