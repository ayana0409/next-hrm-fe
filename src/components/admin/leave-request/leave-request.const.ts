import { makeFields } from "@/utils/fields";

export const LEAVE_REQUEST_ENDPOINT = "leave-request";

export const LEAVE_REQUEST_FIELDS = makeFields({
  FULL_NAME: {
    title: "Name",
    key: "fullName",
    dataIndex: ["employee", "fullName"],
    index: 0,
    notInput: true,
    fixed: true,
    width: 200,
  },
  PHONE: {
    title: "Phone",
    key: "phone",
    dataIndex: ["employee", "phone"],
    index: 0,
    notInput: true,
  },
  DEPARTMENT: {
    title: "Department",
    key: "department",
    dataIndex: ["department", "name"],
    index: 0,
    notInput: true,
  },
  POSITION: {
    title: "Position",
    key: "position",
    render: (_: any, record: any) =>
      `${record.position.title} - ${record.position.level}`,
    index: 0,
    notInput: true,
  },
  START_DATE: {
    title: "Start date",
    key: "startDate",
    dataIndex: "startDate",
    index: 0,
    inputType: "date",
    required: true,
  },
  END_DATE: {
    title: "End date",
    key: "endDate",
    dataIndex: "endDate",
    index: 1,
    inputType: "date",
    required: true,
  },
  REASON: {
    title: "Reason",
    key: "reason",
    dataIndex: "reason",
    index: 2,
    inputType: "textarea",
    placeholder: "Enter leave reason",
    required: true,
  },
  STATUS: {
    title: "Status",
    key: "status",
    dataIndex: "status",
    index: 3,
    inputType: "select",
    options: ["pending", "approved", "rejected"],
    fixed: true,
  },
} as const);

export enum LeaveRequestStatusEnum {
  Rejected = "rejected",
  Approved = "approved",
  Pending = "pending",
}
