<template>
  <div class="busCode">
    <i class="icon-wj_ic_ecord"></i>
    <p>乘车码</p>
  </div>
</template>

<script>
export default {
  name: "busCode",
  data() {
    return {
      msg: "乘车码按钮"
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.busCode {
  display: flex;
  align-items: center;
  width: 249px;
  height: 80px;
  background: rgba(15, 200, 153, 1);
  box-shadow: 0px 12px 24px 0px rgba(15, 200, 153, 0.49);
  border-radius: 40px;
}
.busCode i {
  font-size: 42px;
  color: #fff;
  margin-left: 43px;
  margin-right: 21px;
}
.busCode p {
  font-size: 36px;
  color: #fff;
  font-weight: 500;
  height: 100%;
  line-height: 80px;
}
</style>
