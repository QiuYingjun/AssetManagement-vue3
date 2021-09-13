import { createRouter, createWebHashHistory } from "vue-router";
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home/index.vue"),
    },
    {
      path: "/asset",
      name: "asset",
      component: () => import("../views/Asset/index.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("../views/Account/index.vue"),
    },
    {
      path: "/fxrate",
      name: "fxrate",
      component: () => import("../views/FXRate/index.vue"),
    },
  ],
});
