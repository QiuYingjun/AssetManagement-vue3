<template>
  <n-layout has-sider sider-placement="right">
    <n-layout-content>
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    </n-layout-content>
    <n-layout-sider width="500">
      <n-input-group>
        <n-input round v-model:value="server" type="text">
          <template #prefix>
            <n-icon size="20" color="#00cc00" v-if="connecting">
              <bulb />
            </n-icon>
            <n-icon size="20" color="#ff0000" v-else>
              <bulb-off />
            </n-icon>
          </template>
        </n-input>
        <n-button round type="primary" ghost @click="updateServer">连接</n-button>
      </n-input-group>
      {{ hiddenMessage }}
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
  NButton,
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
    NButton,
  },
  setup() {
    return {
      menuOptions,
      message: useMessage(),
    };
  },
  data() {
    return {
      timer: null,
      server: "",
    };
  },
  methods: {
    setTimer() {
      this.$store.dispatch("getConnecting");
    },
    updateServer() {
      this.$store.commit("updateServer", this.server);
      this.$store.dispatch("getConnecting");
    },
  },
  beforeMount() {
    if (localStorage.getItem("server")) {
      this.server = localStorage.getItem("server");
      this.updateServer();
    }
    this.server = this.$store.state.server;
    this.setTimer();
  },
  mounted() {
    this.timer = setInterval(this.setTimer, 5000);
  },
  computed: {
    activeKey() {
      return this.$route.name;
    },
    connecting() {
      if (this.$store.state.connecting[0] && !this.$store.state.connecting[1]) {
        this.$store.commit("pushMessage", { type: "error", text: "后端已断开" });
      } else if (!this.$store.state.connecting[0] && this.$store.state.connecting[1]) {
        this.$store.commit("pushMessage", { type: "success", text: "后端已连接" });
      }
      return this.$store.state.connecting[1];
    },
    hiddenMessage() {
      if (this.$store.state.messageQueue.length > 0) {
        var mes = this.$store.state.messageQueue[0];
        this.message[mes.type](mes.text);
        this.$store.commit("removeMessage");
      }
    },
  },
});
</script>
