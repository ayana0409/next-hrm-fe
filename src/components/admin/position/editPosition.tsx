"use client";
import { Button, Form, Modal, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useDispatch } from "react-redux";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToArray } from "@/utils/fields";

export default function EditPositionButton({ record }: { record: any }) {
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
    axiosAuth
      .patch(`${POSITION_ENDPOINT}/${record._id}`, values)
      .then(() => {
        router.refresh();
        msg.success("Update successul");
        setOpen(false);
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
      });

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
        title="Update Position"
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
