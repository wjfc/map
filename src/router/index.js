import Vue from "vue";
import Router from "vue-router";
import Home from "@/page/home";
import Buslist from "@/page/buslist";
import Destation from "@/page/destation";
import BusMap from "@/page/busMap";
import BusDetail from "@/page/busDetail";
import BusMapPreiview from "@/page/busMapPreview";
import BusLineMapPreiview from "@/page/busLineMapPreview";
import Notice from "@/page/notice";
import BusLines from "@/page/busLines";
import BusLineInfo from "@/page/busLineInfo";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "",
      component: Home
    },
    {
      path: "/buslist",
      name: "",
      component: Buslist
    },
    {
      path: "/destation",
      name: "",
      component: Destation
    },
    {
      path: "/busmap",
      name: "",
      component: BusMap
    },
    {
      path: "/busDetail",
      name: "",
      component: BusDetail
    },
    {
      path: "/busMapPreview",
      name: "",
      component: BusMapPreiview
    },
    {
      path: "/busLineMapPreview",
      name: "",
      component: BusLineMapPreiview
    },
    {
      path: "/notice",
      name: "",
      component: Notice
    },
    {
      path: "/busLines",
      name: "",
      component: BusLines
    },
    {
      path: "/busLineInfo",
      name: "",
      component: BusLineInfo
    }
  ]
});
