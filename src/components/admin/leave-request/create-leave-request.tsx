"use client";
import { Button, Form, Input, Modal, Select, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import EmployeeSelectModal from "../employee/select-employee.modal";
import {
  LEAVE_REQUEST_ENDPOINT,
  LEAVE_REQUEST_FIELDS,
} from "./leave-request.const";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { PlusSquareOutlined } from "@ant-design/icons";

export default function CreateLeaveRequestButton({
  employee,
  onCreated,
}: {
  employee?: { id: string; fullName: string };
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    fullName: string;
  }>(employee || { id: "", fullName: "" });
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const fieldList = fieldsToArray(LEAVE_REQUEST_FIELDS, false, true);

  const onSubmit = async () => {
    const values = await form.validateFields();

    dispatch(startLoading());
    await axiosAuth
      .post(LEAVE_REQUEST_ENDPOINT, values)
      .then(() => {
        msg.success("Add successful");
        setOpen(false);
        form.resetFields();
        onCreated();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Add failed");
      });
    dispatch(stopLoading());
  };

  const handleSelect = (employee: { id: string; fullName: string }) => {
    setSelectedEmployee(employee);
    setOpenEmpModal(false);
  };

  useEffect(() => {
    if (selectedEmployee?.id) {
      form.setFieldsValue({
        employeeId: selectedEmployee.id,
      });
    }
  }, [selectedEmployee]);

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        <PlusSquareOutlined className="mr-2" />
      </Button>

      <Modal
        title="Add Leave Request"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
            <Form.Item
              label="Employee"
              required
              rules={[{ required: true, message: "Employee is required" }]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input disabled value={selectedEmployee?.fullName || ""} />
                <Button type="primary" onClick={() => setOpenEmpModal(true)}>
                  Chose
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item name="employeeId" hidden={true}>
              <Input disabled />
            </Form.Item>
            <AutoFormFields fields={fieldList} />
          </div>
        </Form>
      </Modal>
      <EmployeeSelectModal
        visible={openEmpModal}
        onCancel={() => setOpenEmpModal(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
