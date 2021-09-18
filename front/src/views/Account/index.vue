<template>
  <AccountDataTable />
</template>

<script>
import AccountDataTable from "./components/AccountDataTable.vue";
export default {
  name: "FXRate",
  components: {
    AccountDataTable,
  },
  mounted() {
    if (this.$store.state.account.data.length == 0) {
      this.$store.dispatch("account/getData");
    }
  },
};
</script>
