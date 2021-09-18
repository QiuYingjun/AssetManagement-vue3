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
import { NDataTable, NDatePicker, NInputNumber } from "naive-ui";
import OperationButtons from "@/components/OperationButtons.vue";
import { h, ref } from "vue";
export default {
  name: "FXRateDataTable",
  components: {
    NDataTable,
    NDatePicker,
    NInputNumber,
    OperationButtons,
  },
  setup() {
    return { pagination: { pageSize: 10 } };
  },

  computed: {
    data() {
      return this.$store.state.fxrate.data;
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
                store.commit("fxrate/edit", {
                  id: row.id,
                  field: "date",
                  value: date.toISOString().split("T")[0],
                });
              },
            });
          },
        },
        {
          title: "汇率",
          key: "rate",
          render(row) {
            var t = "";
            if (row.rate) {
              t += row.rate;
            }
            return h(NInputNumber, {
              value: t,
              type: "text",
              disabled: !row.edit,
              placeholder: "",
              "show-button": false,
              "on-update:value": (value) => {
                store.commit("fxrate/edit", {
                  id: row.id,
                  field: "rate",
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
              table: "fxrate",
            });
          },
        },
      ];
    },
  },
};
</script>
