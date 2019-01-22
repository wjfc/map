<template>
  <div
    class="historyList"
    v-if="this.$store.state.historyList && this.$store.state.historyList.length>0"
  >
    <ul class="lists">
      <li
        class="listItem"
        v-for="(v,i) in this.$store.state.historyList"
        :key="i"
        @click="goDestation(v)"
      >
        <p>{{v.name}}</p>
      </li>
    </ul>
    <div class="clear" @click="clearList()">{{clearMsg}}</div>
  </div>
</template>

<script>
export default {
  name: "history",
  data() {
    return {
      msg: "历史或者搜索记录",
      history: [],
      searchHistoryArray: [],
      clearMsg: "取消"
    };
  },
  created() {
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      this.searchHistoryArray = JSON.parse(searchHistory);
    }
  },
  mounted() {},
  methods: {
    goDestation(v) {
      this.$root.$emit("transterVal", v);
      this.searchHistoryArray.push(v);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(this.searchHistoryArray)
      );
      if (v.location) {
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
    // 清除历史记录或者取消搜索
    clearList() {
      this.$root.$emit("transterVal", {
        name: ""
      });
    }
  },
  computed: {},
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
