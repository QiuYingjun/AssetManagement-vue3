<template>
  <n-popselect
    v-model:value="value"
    :options="options"
    trigger="click"
    :on-update:value="(value) => changeAccount(value)"
  >
    <n-button :disabled="!record.edit">{{ selectedLabel || "选择账户" }}</n-button>
  </n-popselect>
</template>
<script>
import { NPopselect, NButton } from "naive-ui";
import { ref } from "vue";
export default {
  name: "AccountSelect",
  components: {
    NPopselect,
    NButton,
  },
  props: {
    record: {
      type: Object,
    },
  },
  setup(props) {
    return { value: ref(props.record.accountId) };
  },
  computed: {
    options() {
      try {
        var list = [];
        this.$store.state.account.data.forEach((account) => {
          if (account.active || this.record.id > 0) {
            list.push({ label: account.name, value: account.id });
          }
        });
        return list;
      } catch (e) {
        return [{ label: "-", value: "-" }];
      }
    },
    selectedLabel() {
      try {
        var label = this.$store.state.account.data.find((a) => a.id == this.value);
        return label.name;
      } catch (e) {
        console.log(e);
        return "";
      }
    },
  },
  methods: {
    changeAccount(value) {
      this.$store.commit("asset/edit", {
        id: this.record.id,
        field: "accountId",
        value: value,
      });
      this.value = value;
    },
  },
  watch: {
    record: function () {
      this.value = this.record.accountId;
    },
  },
};
</script>
