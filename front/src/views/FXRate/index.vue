<template>
  <FXRateDataTable />
</template>

<script>
import FXRateDataTable from "./components/FXRateDataTable.vue";
export default {
  name: "FXRate",
  components: {
    FXRateDataTable,
  },
  mounted() {
    if (this.$store.state.fxrate.data.length == 0) {
      this.$store.dispatch("fxrate/getData");
    }
  },
};
</script>
