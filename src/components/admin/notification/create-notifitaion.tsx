"use client";
import { Button, Form, Input, Modal, Select, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import EmployeeSelectModal from "../employee/select-employee.modal";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { PlusSquareOutlined } from "@ant-design/icons";
import { NOTIFICATION_ENDPOINT } from "./notificaton.const";
import { SyncOutlined, CloseOutlined } from "@ant-design/icons";
import EmployeeMutiSelectModal from "../employee/muti-select-employee.modal";
import DepartmentMutiSelectModal from "../department/muti-select-department.modal";
import PositionMutiSelectModal from "../position/muti-select-position.modal";

export default function CreateNotificationButton({
  employee,
  onCreated,
}: {
  employee?: { id: string; fullName: string };
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [openDepModal, setOpenDepModal] = useState(false);
  const [openPosModal, setOpenPosModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const [notiType, setNotiType] = useState();

  const onSubmit = async () => {
    const values = await form.validateFields();

    if (selectedIds.length <= 0 || !notiType) {
      msg.error("Please select at least one target");
      return;
    }

    const endPoint =
      notiType === "individual"
        ? "employees"
        : notiType === "department"
        ? "departments"
        : "positions";
    dispatch(startLoading());

    await axiosAuth
      .post(`${NOTIFICATION_ENDPOINT}/send/${endPoint}`, values)
      .then(() => {
        msg.success("Add successful");
        setOpen(false);

        setSelectedIds([]);
        form.resetFields();
        setNotiType(undefined);
        onCreated();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Add failed");
      });
    dispatch(stopLoading());
  };

  const handleSelect = (ids: string[]) => {
    setSelectedIds(ids);
    setOpenEmpModal(false);
    setOpenDepModal(false);
    setOpenPosModal(false);
  };

  useEffect(() => {
    if (selectedIds) {
      const field =
        notiType === "individual"
          ? "employeeIds"
          : notiType === "department"
          ? "departmentIds"
          : "positionIds";

      form.setFieldValue(field, selectedIds);
    }
  }, [selectedIds]);

  useEffect(() => {
    setSelectedIds([]);
  }, [notiType]);

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        <PlusSquareOutlined className="mr-2" />
      </Button>

      <Modal
        title="Create Notification"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
        width={{
          xs: "95%",
          sm: "85%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "60%",
        }}
      >
        <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
          <Select
            placeholder="Chose Notification Type"
            value={notiType}
            options={[
              { label: "Individual", value: "individual" },
              { label: "Department", value: "department" },
              { label: "Position", value: "position" },
            ]}
            onChange={(value) => setNotiType(value)}
            allowClear
          />
          {notiType === "individual" && (
            <Button type="primary" onClick={() => setOpenEmpModal(true)}>
              Chose Employee
            </Button>
          )}
          {notiType === "department" && (
            <Button type="primary" onClick={() => setOpenDepModal(true)}>
              Chose Department
            </Button>
          )}
          {notiType === "position" && (
            <Button type="primary" onClick={() => setOpenPosModal(true)}>
              Chose Position
            </Button>
          )}
          |
          <button
            className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
            onClick={() => {
              setNotiType(undefined);
              setSelectedIds([]);
            }}
          >
            <SyncOutlined />
          </button>
        </Space>
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
            {!notiType || (
              <>
                <Form.Item
                  label={
                    notiType === "individual"
                      ? "Employees"
                      : notiType === "department"
                      ? "Departments"
                      : "Positions"
                  }
                  required
                >
                  <Input disabled value={`Selected: ${selectedIds.length}`} />
                </Form.Item>
                <Form.Item
                  name={
                    notiType === "individual"
                      ? "employeeIds"
                      : notiType === "department"
                      ? "departmentIds"
                      : "positionIds"
                  }
                  hidden={true}
                >
                  <Input disabled />
                </Form.Item>
              </>
            )}
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <EmployeeMutiSelectModal
        visible={openEmpModal}
        onCancel={() => setOpenEmpModal(false)}
        onSelect={handleSelect}
      />
      <DepartmentMutiSelectModal
        visible={openDepModal}
        onCancel={() => setOpenDepModal(false)}
        onSelect={handleSelect}
      />
      <PositionMutiSelectModal
        visible={openPosModal}
        onCancel={() => setOpenPosModal(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
