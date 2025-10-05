"use client";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import { handleDelete } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();

  const onConfirm = async () => {
    try {
      await handleDelete(id);
      msg.success("Xoá thành công", 3);
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Xoá thất bại", 3);
    }
  };

  return (
    <>
      {contextHolder}
      <Button danger type="link" onClick={() => setOpen(true)}>
        Delete
      </Button>
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
