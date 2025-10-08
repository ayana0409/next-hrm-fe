import { makeFields } from "@/utils/fields";

export const USER_ENDPOINT = "user";

export const USER_FIELDS = makeFields({
  USERNAME: {
    title: "Username",
    key: "username",
    dataIndex: "username",
    index: 0,
    fixed: true,
    inputType: "input",
    required: true,
    placeholder: "Enter username",
    width: 400,
  },
  PASSWORD: {
    title: "Password",
    key: "password",
    dataIndex: "password",
    index: 1,
    inputType: "input",
    placeholder: "Enter password",
    min: 0,
    hidden: true,
  },
  CONFIRM_PASSWORD: {
    title: "Confirm Password",
    key: "confirm_password",
    dataIndex: "confirm_password",
    index: 2,
    inputType: "input",
    placeholder: "Enter confirm password",
    min: 0,
    hidden: true,
  },
  ROLE: {
    title: "Role",
    key: "role",
    dataIndex: "role",
    index: 3,
    inputType: "select",
    placeholder: "Select role",
    options: ["employee", "manager", "admin"],
  },
  FULLNAME: {
    title: "Full Name",
    key: "fullname",
    dataIndex: ["employee", "fullName"],
    index: 4,
  },
  EMAIL: {
    title: "Email",
    key: "email",
    dataIndex: ["employee", "email"],
    index: 5,
  },

  PHONE: {
    title: "Phone",
    key: "Phone",
    dataIndex: ["employee", "phone"],
    index: 5,
  },
} as const);
