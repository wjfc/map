<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  font-family: sans-serif, Arial, Helvetica;
}
#app {
  width: 100%;
  height: 100%;
  background: #fff;
}
/* 公共样式解决插入html css失效 */
#bus-normal.bus span {
  display: inline-block;
  font-size: 28px;
  line-height: 28px;
  color: #212121;
  padding: 12px 22px;
  box-sizing: border-box;
  border: 2px solid rgba(33, 33, 33, 1);
  border-radius: 8px;
}
#bus-normal.bus i {
  margin: 0 19px;
}
#bus-normal.bus i:last-child {
  display: none;
}
/* 公共样式解决插入html css失效 */
/* swiper样式 */
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-pagination-bullet {
}
.swiper-pagination-bullet-active {
  opacity: 1;
  background: #37cabe !important;
}
.swiper-slide {
  width: 100% !important;
  margin-left: 0px;
}

.swiper-button-prev {
  display: none;
  left: 0;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%2337cabe'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-next {
  display: none;
  right: 0;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%2337cabe'%2F%3E%3C%2Fsvg%3E");
}

a:active {
  text-decoration: none;
}
</style>
