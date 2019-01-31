<template>
  <div class="previewBtn">
    <img src="../../static/images/mapPreview.png" alt class="btn">
  </div>
</template>

<script>
export default {
  name: "previewBtn",
  data() {
    return {
      msg: "地图预览按钮"
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.previewBtn {
  width: 190px;
  height: 107px;
}
.previewBtn .btn {
  width: 190px;
  height: 107px;
}
</style>
