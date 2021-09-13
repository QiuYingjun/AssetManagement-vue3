<template>
  <AssetDataTable />
</template>

<script>
import AssetDataTable from "./components/AssetDataTable.vue";
export default {
  name: "Asset",
  components: {
    AssetDataTable,
  },
  mounted() {
    if (this.$store.state.asset.data.length == 0) {
      this.$store.dispatch("asset/getData");
    }
    if (this.$store.state.account.data.length == 0) {
      this.$store.dispatch("account/getData");
    }
  },
};
</script>
