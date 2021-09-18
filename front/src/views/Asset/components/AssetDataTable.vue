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
import { NTable, NDataTable, NDatePicker, NInput } from "naive-ui";
import OperationButtons from "@/components/OperationButtons.vue";
import AccountSelect from "./AccountSelect.vue";

import { h, ref } from "vue";
export default {
  name: "AssetDataTable",
  components: {
    NTable,
    NDataTable,
    NDatePicker,
    NInput,
    OperationButtons,
    AccountSelect,
  },

  setup() {
    return { pagination: { pageSize: 10 } };
  },
  computed: {
    data() {
      return this.$store.state.asset.data;
    },
    columns() {
      var store = this.$store;
      return [
        {
          title: "日期",
          key: "date",
          render(row) {
            return h(NDatePicker, {
              value: Date.parse(row.date),
              type: "date",
              disabled: !row.edit,
              "on-update:value": (value) => {
                var date = new Date(value);
                date.setTime(value - date.getTimezoneOffset() * 60 * 1000);
                store.commit("asset/edit", {
                  id: row.id,
                  field: "date",
                  value: date.toISOString().split("T")[0],
                });
              },
            });
          },
        },
        {
          title: "账户",
          key: "accountId",
          render(row) {
            return h(AccountSelect, { record: row });
          },
        },
        {
          title: "金额",
          key: "amount",
          render(row) {
            var t = "";
            if (row.amount) {
              t += row.amount;
            }
            return h(NInput, {
              value: t,
              type: "text",
              disabled: !row.edit,
              placeholder: "",
              "on-update:value": (value) => {
                store.commit("asset/edit", {
                  id: row.id,
                  field: "amount",
                  value: value,
                });
              },
            });
          },
        },
        {
          title: "操作",
          key: "edit",
          width: 400,
          render(row) {
            return h(OperationButtons, {
              record: row,
              table: "asset",
            });
          },
        },
      ];
    },
  },
};
</script>
