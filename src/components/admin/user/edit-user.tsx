"use client";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";
import { USER_ENDPOINT } from "./user.const";
import { useAxiosAuth } from "@/utils/customHook";
import { EditFilled } from "@ant-design/icons";
import EmployeeSelectModal from "../employee/select-employee.modal";

export default function EditUserButton({
  record,
  onUpdated,
}: {
  record: any;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    fullName: string;
  }>({ id: record.employee.id, fullName: record.employee.fullName });
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const onSubmit = async () => {
    const values = await form.validateFields();

    dispatch(startLoading());
    axiosAuth
      .patch(`${USER_ENDPOINT}/${record._id}`, values)
      .then(() => {
        msg.success("Update successul");
        setOpen(false);
        form.resetFields();
        onUpdated();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
      });

    dispatch(stopLoading());
  };

  const handleSelect = (employee: { id: string; fullName: string }) => {
    setSelectedEmployee(employee);
    setOpenEmpModal(false);
  };

  useEffect(() => {
    if (
      selectedEmployee?.id &&
      form.getFieldInstance &&
      form.getFieldInstance("employeeId")
    ) {
      form.setFieldsValue({
        employeeId: selectedEmployee.id,
      });
    }
  }, [selectedEmployee]);

  return (
    <>
      {contextHolder}
      <Tooltip title="Edit" className="m-2">
        <button
          onClick={() => {
            form.setFieldsValue(record);
            form.setFieldsValue({
              employeeId: record.employee.id,
            });
            setOpen(true);
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <EditFilled className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Update User"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username">
            <Input />
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
            <Input disabled value={selectedEmployee.id} />
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
