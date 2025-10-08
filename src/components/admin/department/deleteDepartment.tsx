"use client";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxiosAuth } from "@/utils/customHook";
import { DEPARTMENT_ENDPOINT } from "./department.const";

export default function DeleteDepartmentButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const onConfirm = async () => {
    await axiosAuth
      .delete(`${DEPARTMENT_ENDPOINT}/${id}`)
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
