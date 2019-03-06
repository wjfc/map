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
import NoticeInfo from "@/page/noticeInfo";
import BusLines from "@/page/busLines";
import BusLineInfo from "@/page/busLineInfo";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/dist/",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/index.html",
      name: "home",
      component: Home
    },
    {
      path: "/buslist",
      name: "busList",
      component: Buslist
    },
    {
      path: "/destation",
      name: "destation",
      component: Destation
    },
    {
      path: "/busmap",
      name: "busMap",
      component: BusMap
    },
    {
      path: "/busDetail",
      name: "busDetail",
      component: BusDetail
    },
    {
      path: "/busMapPreview",
      name: "busMapPreview",
      component: BusMapPreiview
    },
    {
      path: "/busLineMapPreview",
      name: "busLineMapPreview",
      component: BusLineMapPreiview
    },
    {
      path: "/notice",
      name: "notice",
      component: Notice
    },
    {
      path: "/noticeInfo",
      name: "noticeInfo",
      component: NoticeInfo
    },
    {
      path: "/busLines",
      name: "busLines",
      component: BusLines
    },
    {
      path: "/busLineInfo",
      name: "busLineInfo",
      component: BusLineInfo
    }
  ]
});
