"use client";
import StackBarChart from "@/components/chart/stack-bar.chart";
import { useAxiosAuth } from "@/utils/customHook";
import { getSixMonthRangeDayjs } from "@/utils/date";
import { SyncOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { SALARY_ENDPOINT } from "../salary/salary.const";

interface ChartData {
  categories: string[];
  data: number[][];
}

const { start, end } = getSixMonthRangeDayjs();
const seriesNames = ["Absence Days", "Off Days", "Work Days"];

export const AttendanceChart = ({ employeeId }: { employeeId: string }) => {
  const { RangePicker } = DatePicker;
  const [searchDate, setSearchDate] = useState<
    [start: Dayjs | null | undefined, end: Dayjs | null | undefined]
  >([start, end]);

  const axiosAuth = useAxiosAuth();
  const [chartData, setChartData] = useState<ChartData>();

  let fetchData = async () => {
    await axiosAuth
      .get(`${SALARY_ENDPOINT}/range`, {
        params: {
          employeeId,
          start: (searchDate[0] as Dayjs).format("YYYY-MM"),
          end: (searchDate[1] as Dayjs).format("YYYY-MM"),
        },
      })
      .then((res) => {
        const categories: string[] = [];
        const absenceDays: number[] = [];
        const offDates: number[] = [];
        const workDates: number[] = [];

        res.data.data.forEach((item: any) => {
          categories.push(item.month);
          absenceDays.push(item.absenceDays);
          offDates.push(item.offDates);
          workDates.push(item.workDates);
        });
        setChartData({ categories, data: [absenceDays, offDates, workDates] });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (searchDate) fetchData();
  }, [searchDate]);

  const handleDateChange = (values: any) => {
    try {
      setSearchDate(values);
    } catch {
      setSearchDate([null, null]);
    }
  };

  return (
    <div>
      <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
        <RangePicker
          onChange={handleDateChange}
          value={searchDate}
          format="YYYY-MM"
          picker="month"
        />
        |
        <button
          className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
          onClick={() => {
            handleDateChange([start, end]);
          }}
        >
          <SyncOutlined />
        </button>
      </Space>
      {chartData && (
        <StackBarChart
          id={employeeId}
          rawData={chartData?.data}
          seriesNames={seriesNames}
          categories={chartData?.categories}
        />
      )}
    </div>
  );
};
