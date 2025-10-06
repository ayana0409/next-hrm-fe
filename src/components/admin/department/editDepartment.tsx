"use client";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import { handleEdit } from "./actions";
import { useRouter } from "next/navigation";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useDispatch } from "react-redux";

export default function EditDepartmentButton({ record }: { record: any }) {
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
      msg.success("Update successul");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Update failed");
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
        title="Update Department"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
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
