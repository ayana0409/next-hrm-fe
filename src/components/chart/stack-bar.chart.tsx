import React, { useEffect } from "react";
import * as echarts from "echarts";
import { SeriesOption } from "echarts";

type EChartsOption = echarts.EChartsOption;

interface StackBarChartProps {
  id: string; // ID của thẻ DOM (ví dụ: "main")
  rawData: number[][];
  categories: string[]; // ['Mon', 'Tue', ...]
  seriesNames: string[]; // ['Direct', 'Mail Ad', ...]
}

const StackBarChart: React.FC<StackBarChartProps> = ({
  id,
  rawData,
  categories,
  seriesNames,
}) => {
  useEffect(() => {
    const chartDom = document.getElementById(id);
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    // Tính tổng của từng cột
    const totalData: number[] = [];
    for (let i = 0; i < rawData[0].length; ++i) {
      let sum = 0;
      for (let j = 0; j < rawData.length; ++j) {
        sum += rawData[j][i];
      }
      totalData.push(sum);
    }

    // Tạo series
    const series = seriesNames.map((name, sid) => ({
      name,
      type: "bar",
      stack: "total",
      barWidth: "60%",
      label: {
        show: true,
        formatter: (params: any) => Math.round(params.value * 1000) / 10 + "%",
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      ),
    })) as SeriesOption[];

    const option: EChartsOption = {
      legend: { selectedMode: false },
      yAxis: { type: "value" },
      xAxis: { type: "category", data: categories },
      series,
    };

    myChart.setOption(option);

    // Cleanup khi component unmount
    return () => {
      myChart.dispose();
    };
  }, [id, rawData, categories, seriesNames]);

  return <div id={id} style={{ width: "100%", height: "400px" }} />;
};

export default StackBarChart;
