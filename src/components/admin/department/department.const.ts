import { makeFields } from "@/utils/fields";

export const DEPARTMENT_ENDPOINT = "department";

export const DEPARTMENT_FIELDS = makeFields({
  NAME: {
    title: "Name",
    key: "name",
    dataIndex: "name",
    index: 0,
    fixed: true,
    inputType: "input",
    required: true,
    placeholder: "Enter department name",
    width: 300,
  },
  DESCRIPTION: {
    title: "Description",
    key: "description",
    dataIndex: "description",
    index: 1,
    inputType: "textarea",
    placeholder: "Enter description",
  },
} as const);
