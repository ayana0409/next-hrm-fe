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
import { useAxiosAuth } from "@/utils/customHook";
import { EditFilled } from "@ant-design/icons";
import EmployeeSelectModal from "../employee/select-employee.modal";
import {
  LEAVE_REQUEST_ENDPOINT,
  LEAVE_REQUEST_FIELDS,
} from "./leave-request.const";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";

export default function EditLeaveRequestButton({
  record,
  employee,
  onUpdated,
}: {
  record: any;
  employee?: { id: string; fullName: string };
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    fullName: string;
  }>(
    employee || {
        id: record.employee._id,
        fullName: record.employee.fullName,
      } || { id: "", fullName: "" }
  );

  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const fieldList = fieldsToArray(LEAVE_REQUEST_FIELDS, false, true);

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    axiosAuth
      .patch(`${LEAVE_REQUEST_ENDPOINT}/${record.id}`, values)
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
    if (selectedEmployee?.id) {
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
            setOpen(true);
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <EditFilled className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Update Leave Request"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4">
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
