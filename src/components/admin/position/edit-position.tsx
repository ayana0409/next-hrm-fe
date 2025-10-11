"use client";
import { Form, Modal, Tooltip, message } from "antd";
import { useState } from "react";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToArray } from "@/utils/fields";
import { EditFilled } from "@ant-design/icons";

export default function EditPositionButton({
  record,
  onUpdated,
}: {
  record: any;
  onUpdated: () => void;
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
    axiosAuth
      .patch(`${POSITION_ENDPOINT}/${record._id}`, values)
      .then(() => {
        msg.success("Update successul");
        setOpen(false);
        onUpdated();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
      });

    dispatch(stopLoading());
  };
  return (
    <>
      {contextHolder}
      <Tooltip title="Edit" className="m-2">
        <button
          onClick={() => {
            form.setFieldsValue(record);
            setOpen(true);
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <EditFilled className="mr-2" />
        </button>
      </Tooltip>

      <Modal
        title="Update Position"
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
