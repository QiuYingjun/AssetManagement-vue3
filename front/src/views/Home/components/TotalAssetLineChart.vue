<template>
  <v-chart
    :option="option"
    style="width: 100%; height: 400px"
    :auto-resize="true"
    ref="lineChart"
  />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { defineComponent } from "vue";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
]);
export default defineComponent({
  name: "TotalAssetLineChart",
  components: {
    VChart,
  },
  computed: {
    option() {
      var dateList = [];
      var rmb = [];
      var jpy = [];
      var rate = [];
      this.$store.state.totals.forEach((record) => {
        dateList.push(record.date);
        rmb.push(record.rmb);
        jpy.push(record.jpy);
        rate.push(rate);
      });

      var op = {
        title: {
          text: "总资产",
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["人民币", "日元"],
          right: "10%",
          bottom: "20%",
          orient: "horizontal",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: [
          {
            type: "value",
            name: "人民币",
            position: "left",
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: function (value) {
                return value / 10000 + "万元";
              },
            },
          },
          {
            type: "value",
            name: "日元",
            position: "right",
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: function (value) {
                return value / 10000 + "万円";
              },
            },
          },
        ],
        dataZoom: [
          { type: "slider", show: true, start: 70, end: 100 },
          {
            type: "inside",
            start: 70,
            end: 100,
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0, 1],
            left: "5%",
            start: 0,
          },
        ],
        series: [
          {
            name: "人民币",
            type: "line",
            data: [],
            yAxisIndex: 0,
          },
          {
            name: "日元",
            type: "line",
            data: [],
            yAxisIndex: 1,
          },
        ],
      };
      op.title.subtext =
        "截至" +
        dateList.slice(-1) +
        "：" +
        rmb.slice(-1) +
        "元（" +
        jpy.slice(-1) +
        "日元）";
      op.xAxis.data = dateList;
      op.series = [
        {
          name: "人民币",
          type: "line",
          data: rmb,
          yAxisIndex: 0,
        },
        {
          name: "日元",
          type: "line",
          data: jpy,
          yAxisIndex: 1,
        },
      ];
      return op;
    },
  },
  setup() {},
  mounted() {
    if (this.$store.state.totals.length == 0) {
      this.$store.dispatch("getTotal");
    }
    window.addEventListener("resize", this.resizeTheChart);
  },
  methods: {
    resizeTheChart() {
      if (this.$refs && this.$refs.lineChart) {
        this.$refs.lineChart.resize();
      }
    },
  },
});
</script>

<style scoped></style>
