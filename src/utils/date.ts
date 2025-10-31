import dayjs from "dayjs";

export function getSixMonthsRange(): { start: string; end: string } {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() - 1); // tháng trước
  const startDate = new Date(now.getFullYear(), now.getMonth() - 6); // lùi thêm 5 tháng nữa

  const format = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

  return {
    start: format(startDate),
    end: format(endDate),
  };
}

export function getSixMonthRangeDayjs(): {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
} {
  const end = dayjs().subtract(1, "month");
  const start = dayjs().subtract(6, "month");

  return { start, end };
}
