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
    dispatch(startLoading());
    try {
      const values = await form.validateFields();
      await handleAdd(values);
      msg.success("Add successful");
      setOpen(false);
      form.resetFields();
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Add failed");
    }
    dispatch(stopLoading());
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        + Add Department
      </Button>

      <Modal
        title="Add Department"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Field name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
