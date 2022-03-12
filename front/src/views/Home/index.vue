<template>
  <div class="container">
    <n-grid :cols="2">
      <n-gi>
        <TotalAssetLineChart />
      </n-gi>
      <n-gi>
        <TotalDataTable />
      </n-gi>
    </n-grid>
    <AssetBarChartByAccount />
  </div>
</template>

<script>
import TotalAssetLineChart from "./components/TotalAssetLineChart.vue";
import AssetBarChartByAccount from "./components/AssetBarChartByAccount.vue";
import TotalDataTable from "./components/TotalDataTable.vue";
import { NGrid, NGi } from "naive-ui";
export default {
  name: "Home",
  components: {
    TotalAssetLineChart,
    AssetBarChartByAccount,
    TotalDataTable,
    NGrid,
    NGi,
  },
};
</script>
<style scoped>
div.container {
  width: 100%;
}
</style>
