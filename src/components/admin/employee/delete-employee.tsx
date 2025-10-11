"use client";
import { Modal, Tooltip, message } from "antd";
import { useState } from "react";
import { useAxiosAuth } from "@/utils/customHook";
import { DeleteFilled } from "@ant-design/icons";
import { EMPLOYEE_ROUTE } from "./employee.const";

export default function DeleteEmployeeButton({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const axiosAuth = useAxiosAuth();

  const onConfirm = async () => {
    await axiosAuth
      .delete(`${EMPLOYEE_ROUTE}/${id}`)
      .then(() => {
        msg.success("Delete successful", 3);
        setOpen(false);
        onDeleted();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Delete failed", 3);
      });
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Delete">
        <button
          onClick={() => setOpen(true)}
          aria-label="Delete"
          className="bg-red-600 text-white hover:bg-red-800 rounded px-3 py-1 transition shadow-sm"
        >
          <DeleteFilled className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Delete confirm"
        open={open}
        onOk={onConfirm}
        onCancel={() => setOpen(false)}
      >
        Are you sure you want to delete this Employee?
      </Modal>
    </>
  );
}
