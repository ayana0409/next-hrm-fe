"use client";
import { Button, Form, Modal, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToArray } from "@/utils/fields";

export default function CreatePositionButton() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const fieldList = fieldsToArray(POSITION_FIELDS);

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    console.log(values);
    await axiosAuth
      .post(POSITION_ENDPOINT, values)
      .then(() => {
        msg.success("Add successful");
        setOpen(false);
        form.resetFields();
        router.refresh();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Add failed");
      });
    dispatch(stopLoading());
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        + Add Position
      </Button>

      <Modal
        title="Add Position"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <AutoFormFields fields={fieldList} />
        </Form>
      </Modal>
    </>
  );
}
