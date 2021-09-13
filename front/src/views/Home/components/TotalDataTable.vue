<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="data"
    :pagination="pagination"
    size="small"
  />
</template>
<script>
import { NDataTable } from "naive-ui";
export default {
  name: "TotalDataTable",
  components: {
    NDataTable,
  },
  setup() {
    const columns = [
      {
        title: "日期",
        key: "date",
      },
      {
        title: "人民币",
        key: "rmb",
      },
      {
        title: "日元",
        key: "jpy",
      },
      {
        title: "汇率",
        key: "rate",
      },
    ];
    return { columns, pagination: { pageSize: 10 } };
  },
  computed: {
    data() {
      var newData = [];
      for (var i = this.$store.state.totals.length - 1; i > -1; i--) {
        newData.push(this.$store.state.totals[i]);
      }
      for (var i = 10 - (this.$store.state.totals.length % 10); i > 0; i--) {
        newData.push({ date: "-", rmb: "-", jpy: "-", rate: "-" });
      }
      return newData;
    },
  },
};
</script>
