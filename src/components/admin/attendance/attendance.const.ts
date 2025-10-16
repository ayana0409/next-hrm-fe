import { makeFields } from "@/utils/fields";

export const ATTENDANCE_ENDPOINT = "attendance";

export const ATTENDANCE_FIELDS = makeFields({
  CHECK_IN: {
    title: "In",
    key: "checkIn",
    dataIndex: "checkIn",
    index: 0,
    inputType: "date",
    notInput: true,
  },
  CHECK_OUT: {
    title: "Out",
    key: "checkOut",
    dataIndex: "checkOut",
    index: 0,
    inputType: "date",
    notInput: true,
  },
  // STATUS: {
  //   title: "Status",
  //   key: "status",
  //   dataIndex: "status",
  //   index: 0,
  //   inputType: "input",
  // },
} as const);
