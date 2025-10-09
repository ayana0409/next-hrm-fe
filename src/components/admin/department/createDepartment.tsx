"use client";
import { Button, Form, Modal, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { DEPARTMENT_ENDPOINT, DEPARTMENT_FIELDS } from "./department.const";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";

export default function CreateDepartmentButton() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
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
      <Button className="" type="primary" onClick={() => setOpen(true)}>
        + Add Department
      </Button>

      <Modal
        title="Add Department"
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
