<template>
  <div id="app">
    <n-layout>
      <n-layout-header>
        <n-message-provider>
          <Navbar />
        </n-message-provider>
      </n-layout-header>
      <n-layout-content>
        <router-view></router-view>
      </n-layout-content>
      <!-- <n-layout-footer>成府路</n-layout-footer> -->
    </n-layout>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMessageProvider,
} from "naive-ui";

export default {
  components: {
    Navbar,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NMessageProvider,
  },
  setup() {
    return {};
  },
};
</script>
