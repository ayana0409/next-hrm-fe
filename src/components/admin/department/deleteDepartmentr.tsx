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
      msg.success("Delete successful", 3);
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      msg.error(error?.message || "Delete failed", 3);
    }
  };

  return (
    <>
      {contextHolder}
      <Button danger type="link" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Modal
        title="Delete confirm"
        open={open}
        onOk={onConfirm}
        onCancel={() => setOpen(false)}
      >
        Are you sure you want to delete this Department?
      </Modal>
    </>
  );
}
