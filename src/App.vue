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
</style>
