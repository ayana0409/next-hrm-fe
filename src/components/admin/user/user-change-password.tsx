"use client";
import { Button, Form, Input, Modal, Popconfirm, Tooltip, message } from "antd";
import { useState } from "react";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";
import { useAxiosAuth } from "@/utils/customHook";
import { LockOutlined } from "@ant-design/icons";
import { EMPLOYEE_ROUTE } from "../employee/employee.const";
import { USER_ENDPOINT } from "./user.const";

export default function UserChangePasswordButton({
  userId,
}: {
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (values.newPassword !== values.confirmNewPassword) {
      msg.error("Passwords do not match");
      return;
    }
    delete values.confirmNewPassword;
    dispatch(startLoading());
    axiosAuth
      .patch(`${USER_ENDPOINT}/${userId}/change-password`, values)
      .then(() => {
        msg.success("Update successul");
        setOpen(false);
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
      });

    dispatch(stopLoading());
  };

  const handleReset = () => {
    console.log("reset password");
    axiosAuth
      .patch(`${USER_ENDPOINT}/${userId}/reset-password`)
      .then(() => {
        msg.success("Reset password successful");
        setOpen(false);
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Reset password failed");
      });
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Change Password">
        <button
          onClick={() => {
            setOpen(true);
          }}
          aria-label="Change Password"
          className="bg-red-400 text-white hover:bg-red-800 rounded px-3 py-1 transition shadow-sm"
        >
          <LockOutlined className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Change Password"
        open={open}
        footer={[
          <Popconfirm
            title="Reset the password"
            description="Are you sure to reset this password?"
            onConfirm={handleReset}
            okText="Yes"
            cancelText="No"
          >
            <Button
              key="reset"
              color="danger"
              variant="solid"
              className="float-left"
            >
              Reset Password
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={onSubmit}>
            OK
          </Button>,
        ]}
        width={{
          xs: "95%",
          sm: "85%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "60%",
        }}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label="Confirm New Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
