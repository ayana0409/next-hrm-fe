import { makeFields } from "@/utils/fields";

export const SALARY_ENDPOINT = "salary";

export const SALARY_FIELDS = makeFields({
  FULL_NAME: {
    title: "FullName",
    key: "fullName",
    dataIndex: "fullName",
    index: 0,
    fixed: true,
    width: 200,
  },
  DEPARTMENT: {
    title: "Department",
    key: "department",
    dataIndex: "department",
    index: 1,
  },
  POSITION: {
    title: "Position",
    key: "position",
    dataIndex: "position",
    index: 2,
  },
  MONTH: {
    title: "Month",
    key: "month",
    dataIndex: "month",
    index: 2,
  },
  BASE_SALARY: {
    title: "Base salary",
    key: "baseSalary",
    dataIndex: "baseSalary",
    index: 3,
  },
  BONUS: {
    title: "Bonus",
    key: "bonus",
    dataIndex: "bonus",
    index: 4,
  },
  DEDUCTIONS: {
    title: "Deductions",
    key: "deductions",
    dataIndex: "deductions",
    index: 5,
  },
  NET: {
    title: "Net",
    key: "netSalary",
    dataIndex: "netSalary",
    index: 6,
  },
} as const);
