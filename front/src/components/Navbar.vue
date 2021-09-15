<template>
  <n-layout has-sider sider-placement="right">
    <n-layout-content>
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    </n-layout-content>
    <n-layout-sider width="300">
        <n-input-group>
          <n-icon size="40" color="#00cc00" v-if="this.$store.state.connecting[1]">
            <bulb />
          </n-icon>
          <n-icon size="40" color="#ff0000" v-else>
            <bulb-off />
          </n-icon>
          <n-input v-model:value="server" type="text" :placeholder="server" />
          <n-button type="primary" ghost>连接</n-button>
        </n-input-group>
    </n-layout-sider>
  </n-layout>
</template>

<script>
import { defineComponent, h, ref } from "vue";
import {
  NIcon,
  NMenu,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  useMessage,
  NInputGroup,
  NInput,
  NButton
} from "naive-ui";

import { ChartLine, CurrencyDollar, Bulb, BulbOff } from "@vicons/tabler";
import { PriceChangeOutlined, AccountBalanceOutlined } from "@vicons/material";
import { RouterLink } from "vue-router";
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: "/",
        },
        "总资产"
      ),
    key: "home",
    icon: renderIcon(ChartLine),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: "/asset",
        },
        "资产"
      ),
    key: "asset",
    icon: renderIcon(CurrencyDollar),
  },
  {
    label: () =>
      h(
        "a",
        {
          href: "#/fxrate",
        },
        "汇率"
      ),
    key: "fxrate",
    icon: renderIcon(PriceChangeOutlined),
  },
  {
    label: () =>
      h(
        "a",
        {
          href: "#/account",
        },
        "账户"
      ),
    key: "account",
    icon: renderIcon(AccountBalanceOutlined),
  },
];

export default defineComponent({
  name: "Navbar",
  components: {
    NMenu,
    NLayout,
    NLayoutContent,
    NLayoutSider,
    NIcon,
    Bulb,
    BulbOff,
    NInputGroup,
    NInput,
    NButton
  },
  setup() {
    return {
      menuOptions,
      timer: null,
      message: useMessage(),
      server: ""
    };
  },
  methods: {
    setTimer() {
      if (this.$store.state.connecting[0] && !this.$store.state.connecting[1]) {
        this.message.error("后端已断开");
      } else if (!this.$store.state.connecting[0] && this.$store.state.connecting[1]) {
        this.message.success("后端已连接");
      }
      this.$store.dispatch("getConnecting");
    },
  },
  mounted() {
    this.timer = setInterval(this.setTimer, 10000);
    this.server = this.$store.state.server;
  },
  computed: {
    activeKey() {
      return this.$route.name;
    },
  },
});
</script>
