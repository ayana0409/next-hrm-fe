"use client";
import { Button, Form, Modal, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { DEPARTMENT_ENDPOINT, DEPARTMENT_FIELDS } from "./department.const";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";

export default function CreateDepartmentButton({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const fieldList = fieldsToArray(DEPARTMENT_FIELDS);

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    await axiosAuth
      .post(DEPARTMENT_ENDPOINT, values)
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
      <Button className="" type="primary" onClick={() => setOpen(true)}>
        + Add Department
      </Button>

      <Modal
        title="Add Department"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
            <AutoFormFields fields={fieldList} />
          </div>
        </Form>
      </Modal>
    </>
  );
}
