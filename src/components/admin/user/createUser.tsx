"use client";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import { handleAdd } from "./actions";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loadingSlice";

export default function CreateUserButton() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(startLoading("Đang thêm người dùng..."));
    try {
      const values = await form.validateFields();
      await handleAdd(values);
      msg.success("Thêm người dùng thành công");
      setOpen(false);
      form.resetFields();
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Thêm thất bại");
    }
    dispatch(stopLoading());
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        + Add User
      </Button>

      <Modal
        title="Thêm người dùng"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password là bắt buộc" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmedPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: "Xác nhận mật khẩu là bắt buộc" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
