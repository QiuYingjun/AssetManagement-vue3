<template>
  <n-grid :cols="2">
    <n-gi>
      <LineChart />
    </n-gi>
    <n-gi>
      <TotalDataTable />
    </n-gi>
  </n-grid>
</template>

<script>
import LineChart from "./components/LineChart.vue";
import TotalDataTable from "./components/TotalDataTable.vue";
import { NGrid, NGi } from "naive-ui";
export default {
  name: "Home",
  components: {
    LineChart,
    TotalDataTable,
    NGrid,
    NGi,
  },
};
</script>
<style scoped></style>
