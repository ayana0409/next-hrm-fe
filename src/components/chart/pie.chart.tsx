import React, { useEffect } from "react";
import * as echarts from "echarts";

type EChartsOption = echarts.EChartsOption;

interface PieChartProps {
  id: string; // ID of DOM container
  title?: string;
  subtext?: string;
  data: { value: number; name: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ id, title, subtext, data }) => {
  useEffect(() => {
    const chartDom = document.getElementById(id);
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option: EChartsOption = {
      title: title
        ? {
            text: title,
            subtext: subtext ?? "",
            left: "center",
          }
        : undefined,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Data",
          type: "pie",
          radius: "50%",
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            formatter: "{b}: {d}%",
          },
        },
      ],
    };

    myChart.setOption(option);

    // cleanup
    return () => {
      myChart.dispose();
    };
  }, [id, title, subtext, data]);

  return <div id={id} style={{ width: "100%", height: "400px" }} />;
};

export default PieChart;
