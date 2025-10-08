import { makeFields } from "@/utils/fields";

export const POSITION_ENDPOINT = "position";

export const POSITION_FIELDS = makeFields({
  TITLE: {
    title: "Title",
    key: "title",
    dataIndex: "title",
    index: 0,
    fixed: true,
    inputType: "input",
    required: true,
    placeholder: "Enter position title",
    width: 400,
  },
  SALARY: {
    title: "Salary",
    key: "salary",
    dataIndex: "salary",
    index: 1,
    inputType: "number",
    placeholder: "Enter salary",
    min: 0,
  },
  LEVEL: {
    title: "Level",
    key: "level",
    dataIndex: "level",
    index: 2,
    inputType: "input",
    placeholder: "Enter level",
  },
  DESCRIPTION: {
    title: "Description",
    key: "description",
    dataIndex: "description",
    index: 3,
    inputType: "textarea",
    placeholder: "Enter description",
  },
} as const);
