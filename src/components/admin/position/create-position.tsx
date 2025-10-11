"use client";
import { Button, Form, Modal, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToArray } from "@/utils/fields";

export default function CreatePositionButton({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const fieldList = fieldsToArray(POSITION_FIELDS);

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    await axiosAuth
      .post(POSITION_ENDPOINT, values)
      .then(() => {
        msg.success("Add successful");
        setOpen(false);
        form.resetFields();
        onCreated();
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AutoFormFields fields={fieldList} />
          </div>
        </Form>
      </Modal>
    </>
  );
}
