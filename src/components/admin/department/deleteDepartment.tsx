"use client";
import { Button, Modal, Tooltip, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAxiosAuth } from "@/utils/customHook";
import { DEPARTMENT_ENDPOINT } from "./department.const";
import { DeleteFilled } from "@ant-design/icons";

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
      <Tooltip title="Delete">
        <Button
          onClick={() => setOpen(true)}
          aria-label="Delete"
          className="bg-red-600 text-white hover:bg-red-700 rounded px-3 py-1 transition shadow-sm"
          style={{ border: "none" }}
        >
          <DeleteFilled className="mr-2" />
          Delete
        </Button>
      </Tooltip>
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
