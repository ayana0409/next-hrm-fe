"use client";
import { Button, Modal, Tooltip, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxiosAuth } from "@/utils/customHook";
import { USER_ENDPOINT } from "./user.const";
import { DeleteFilled } from "@ant-design/icons";

export default function DeleteUserButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const onConfirm = async () => {
    await axiosAuth
      .delete(`${USER_ENDPOINT}/${id}`)
      .then(() => {
        router.refresh();
        msg.success("Delete successful", 3);
        setOpen(false);
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Delete failed", 3);
      });
  };

  return (
    <>
      {contextHolder}
      <Tooltip title="Delete">
        <Button
          onClick={() => setOpen(true)}
          aria-label="Delete"
          className="bg-red-600 text-white hover:bg-red-700 rounded px-3 py-1 transition shadow-sm"
          style={{ border: "none" }}
        >
          <DeleteFilled className="mr-2" />
        </Button>
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
