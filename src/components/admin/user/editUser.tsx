"use client";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import { handleEdit } from "./actions";
import { useRouter } from "next/navigation";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useDispatch } from "react-redux";

export default function EditUserButton({ record }: { record: any }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(startLoading());
    try {
      const values = await form.validateFields();
      await handleEdit(record._id, values);
      msg.success("Update user successul");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Update user failed");
    }
    dispatch(stopLoading());
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        onClick={() => {
          form.setFieldsValue(record);
          setOpen(true);
          router.refresh();
        }}
      >
        Edit
      </Button>
      <Modal
        title="Sửa người dùng"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username">
            <Input />
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
