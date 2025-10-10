"use client";
import { Button, Form, Input, Modal, Select, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { USER_ENDPOINT } from "./user.const";
import { useAxiosAuth } from "@/utils/customHook";
import EmployeeSelectModal from "../employee/select-employee.modal";

export default function CreateUserButton() {
  const [open, setOpen] = useState(false);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    fullName: string;
  }>({ id: "", fullName: "" });
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (String(values.password) !== String(values.confirmPassword)) {
      msg.error("Mật khẩu xác nhận không khớp");
      dispatch(stopLoading());
      return;
    }
    delete values.confirmPassword;
    dispatch(startLoading());
    await axiosAuth
      .post(USER_ENDPOINT, values)
      .then(() => {
        msg.success("Add successful");
        setOpen(false);
        form.resetFields();
        router.refresh();
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
        + Add User
      </Button>

      <Modal
        title="Thêm người dùng"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password là bắt buộc" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: "Xác nhận mật khẩu là bắt buộc" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Employee">
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
          <Form.Item name="role" label="Role">
            <Select
              options={[
                { label: "Employee", value: "employee" },
                { label: "Manager", value: "manager" },
                { label: "Admin", value: "admin" },
              ]}
            />
          </Form.Item>
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
