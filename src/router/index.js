import Vue from "vue";
import Router from "vue-router";
import Home from "@/page/home";
import Buslist from "@/page/buslist";
import Destation from "@/page/destation";
import BusMap from "@/page/busMap";

Vue.use(Router);

export default new Router({
  mode: "history",
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
    }
  ]
});
