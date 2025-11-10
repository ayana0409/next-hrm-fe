import { makeFields } from "@/utils/fields";

export const AUDIT_LOG_ENDPOINT = "audit-log";

export const AUDIT_LOG_FIELDS = makeFields({
  USER: {
    title: "User",
    key: "username",
    dataIndex: "username",
    index: 0,
    fixed: true,
    width: 300,
  },
  ACTION: {
    title: "Action",
    key: "action",
    dataIndex: "action",
    index: 1,
  },
  MODULE: {
    title: "Module",
    key: "module",
    dataIndex: "module",
    index: 2,
  },
  TIME: {
    title: "Time",
    key: "timestamp",
    dataIndex: "timestamp",
    index: 3,
  },
} as const);
