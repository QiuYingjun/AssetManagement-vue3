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
import { NDataTable, NDatePicker, NInput, NSwitch } from "naive-ui";
import OperationButtons from "@/components/OperationButtons.vue";
import { h, ref } from "vue";
export default {
  name: "AccountDataTable",
  components: {
    NDataTable,
    NDatePicker,
    NInput,
    OperationButtons,
    NSwitch,
  },
  setup() {
    return { pagination: { pageSize: 10 } };
  },

  computed: {
    data() {
      return this.$store.state.account.data;
    },
    columns() {
      var store = this.$store;
      return [
        {
          title: "账户名",
          key: "name",
          render(row) {
            return h(NInput, {
              value: row.name,
              type: "text",
              disabled: !row.edit,
              placeholder: "",
              "on-update:value": (value) => {
                store.commit("account/edit", {
                  id: row.id,
                  field: "name",
                  value: value,
                });
              },
            });
          },
        },
        {
          title: "货币",
          key: "currency",
          render(row) {
            return h(NInput, {
              value: row.currency,
              type: "text",
              disabled: !row.edit,
              placeholder: "",
              "on-update:value": (value) => {
                store.commit("account/edit", {
                  id: row.id,
                  field: "currency",
                  value: value,
                });
              },
            });
          },
        },
        {
          title: "启用",
          key: "is_active",
          render(row) {
            return h(NSwitch, {
              value: row.is_active,
              disabled: !row.edit,
              "on-update:value": (value) => {
                store.commit("account/edit", {
                  id: row.id,
                  field: "is_active",
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
              table: "account",
            });
          },
        },
      ];
    },
  },
};
</script>
