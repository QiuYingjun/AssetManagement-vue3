<template>
  <div>
    <v-chart
      :option="option"
      style="width: 100%; height: 400px"
      :auto-resize="true"
      ref="barChart"
    />
  </div>
</template>
<script>
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { NSwitch } from "naive-ui";

import {
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);
const maxN = (arr, n = 1) =>
  [...Array.from(new Set(arr))].sort((a, b) => b - a).slice(0, n);

import { defineComponent } from "vue";

export default defineComponent({
  name: "AssetBarChartByAccount",
  components: {
    VChart,
    NSwitch,
  },
  methods: {
    resizeTheChart() {
      if (this.$refs && this.$refs.barChart) {
        this.$refs.barChart.resize();
      }
    },
    calcAccountAsset() {
      var accountList = [];
      var dateAsset = [];
      var accountTotal = [];

      this.accountMap.forEach((account, accountId) => {
        if (account.is_active) {
          accountList.push(account.name);
          this.recentDates.forEach((date) => {
            if (!dateAsset[date]) {
              dateAsset[date] = [];
            }
            var record = this.recentRecords.find(
              (record) => record.date == date && record.accountId == accountId
            );
            if (record) {
              var amount = record.amount;
              if (account.currency != "JPY") {
                var fxrate = this.recentRateMap[date]
                  ? this.recentRateMap[date].rate
                  : 20;
                amount *= fxrate;
              }
              amount = Math.round(amount);
              accountTotal[account.name] =
                (accountTotal[account.name] || 0) + amount;

              dateAsset[date].push(amount);
            } else {
              dateAsset[date].push(0);
            }
          });
        }
      });

      const sortedAccountTotal = Object.entries(accountTotal).sort(
        (a, b) => Math.abs(b[1]) - Math.abs(a[1])
      );

      const total = Object.values(accountTotal).reduce((a, b) => {
        return a + Math.abs(b);
      }, 0);

      const newAccountList = [];
      var c = 0;
      sortedAccountTotal.forEach((it) => {
        if (c < 0.9 * total) {
          newAccountList.push(it[0]);
          c += Math.abs(it[1]);
        }
      });

      var newDateAsset = [];
      newAccountList.forEach((name) => {
        const i = accountList.indexOf(name);
        Object.keys(dateAsset).forEach((date) => {
          if (!newDateAsset[date]) {
            newDateAsset[date] = [];
          }
          newDateAsset[date].push(dateAsset[date][i]);
        });
      });
      Object.keys(dateAsset).forEach((date) => {
        console.log(116, newDateAsset[date]);
        newDateAsset[date].push(0);
        newDateAsset[date].push(0);
      });
      accountList
        .filter((it) => !newAccountList.includes(it))
        .forEach((name) => {
          const i = accountList.indexOf(name);
          Object.keys(dateAsset).forEach((date) => {
            if (dateAsset[date][i] > 0) {
              newDateAsset[date][newDateAsset[date].length - 2] +=
                dateAsset[date][i];
            } else {
              newDateAsset[date][newDateAsset[date].length - 1] +=
                dateAsset[date][i];
            }
          });
        });
      newAccountList.push("其它资产", "其它负债");
      return { dateAsset: newDateAsset, accountList: newAccountList };
    },
  },
  mounted() {
    if (this.$store.state.asset.data.length == 0) {
      this.$store.dispatch("asset/getData");
    }
    if (this.$store.state.account.data.length == 0) {
      this.$store.dispatch("account/getData");
    }
    if (this.$store.state.fxrate.data.length == 0) {
      this.$store.dispatch("fxrate/getData");
    }
    window.addEventListener("resize", this.resizeTheChart);
  },
  data() {
    return {};
  },
  computed: {
    recentDates() {
      var data = this.$store.state.asset.data;
      var dateList = maxN(
        data.map((it) => it.date),
        3
      );
      dateList.sort();
      return dateList;
    },
    recentRecords() {
      var data = this.$store.state.asset.data;
      var data = data.filter((it) => this.recentDates.indexOf(it.date) > -1);
      return data;
    },
    recentRateMap() {
      var fxrateData = this.$store.state.fxrate.data;
      var dateList = maxN(
        fxrateData.map((it) => it.date),
        2
      );
      var fxrateMap = [];
      fxrateData
        .filter((it) => dateList.indexOf(it.date) > -1)
        .forEach((it) => {
          fxrateMap[it.date] = it;
        });
      return fxrateMap;
    },
    accountMap() {
      var data = this.$store.state.account.data;
      var m = [];
      data.filter((it) => it.is_active).forEach((it) => (m[it.id] = it));
      console.log(95, m);
      return m;
    },
    option() {
      const { dateAsset, accountList } = this.calcAccountAsset();

      var seriesData = Object.entries(dateAsset).map(([date, assets]) => {
        return { name: date, type: "bar", data: assets };
      });

      var op = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          icon: "rect",
          data: Object.keys(dateAsset),
        },
        xAxis: [
          {
            type: "category",
            data: accountList,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：(日元)",
            position: "left",
            axisLabel: {
              formatter: function (value) {
                return value / 10000 + "万円";
              },
            },
          },
        ],
        series: seriesData,
      };

      return op;
    },
  },
});
</script>
<style scoped>
div.chart {
  height: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>
