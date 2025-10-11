"use client";
import { Button, Modal, Tooltip, message } from "antd";
import { useState } from "react";
import { useAxiosAuth } from "@/utils/customHook";
import { USER_ENDPOINT } from "./user.const";
import { DeleteFilled } from "@ant-design/icons";

export default function DeleteUserButton({
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
      .delete(`${USER_ENDPOINT}/${id}`)
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
        title="Xác nhận xoá người dùng"
        open={open}
        onOk={onConfirm}
        onCancel={() => setOpen(false)}
      >
        Bạn có chắc muốn xoá người dùng này?
      </Modal>
    </>
  );
}
