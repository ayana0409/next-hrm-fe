"use client";
import { Button, Form, Input, Modal, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToArray } from "@/utils/fields";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { EMPLOYEE_FIELDS, EMPLOYEE_ROUTE } from "./employee.const";
import { DepartmentSelectModal } from "../department/select-department.modal";
import { PositionSelectModal } from "../position/select-position.modal";

export default function CreateEmployeeButton() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();
  const [openDepModal, setOpenDepModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    _id: string;
    name: string;
  }>({ _id: "", name: "" });

  const [openPosModal, setOpenPosModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    _id: string;
    title: string;
    level: string;
  }>({ _id: "", title: "", level: "" });
  const router = useRouter();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();
  const fieldList = fieldsToArray(EMPLOYEE_FIELDS, false, true);

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    await axiosAuth
      .post(EMPLOYEE_ROUTE, values)
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

  // Selecting Department
  const handleSelectDep = (department: any) => {
    setSelectedDepartment(department);
    setOpenDepModal(false);
  };

  useEffect(() => {
    if (selectedDepartment?._id) {
      form.setFieldsValue({
        departmentId: selectedDepartment._id,
      });
    }
  }, [selectedDepartment]);

  // Selecting Postion
  const handleSelectPos = (position: any) => {
    setSelectedPosition(position);
    setOpenPosModal(false);
  };

  useEffect(() => {
    if (selectedPosition?._id) {
      form.setFieldsValue({
        possitonId: selectedPosition._id,
      });
    }
  }, [selectedPosition]);

  return (
    <>
      {contextHolder}
      <Button className="" type="primary" onClick={() => setOpen(true)}>
        + Add Employee
      </Button>

      <Modal
        title="Add Employee"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <AutoFormFields fields={fieldList} />

          <Form.Item label="Department">
            <Space.Compact style={{ width: "100%" }}>
              <Input disabled value={selectedDepartment?.name || ""} />
              <Button type="primary" onClick={() => setOpenDepModal(true)}>
                Chose
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="departmentId" hidden={true}>
            <Input disabled />
          </Form.Item>

          <Form.Item label="Position">
            <Space.Compact style={{ width: "100%" }}>
              <Input
                disabled
                value={
                  selectedPosition?.title + " - " + selectedPosition?.level ||
                  ""
                }
              />
              <Button type="primary" onClick={() => setOpenPosModal(true)}>
                Chose
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="positionId" hidden={true}>
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
      <DepartmentSelectModal
        visible={openDepModal}
        onSelect={handleSelectDep}
        onCancel={() => setOpenDepModal(false)}
      />
      <PositionSelectModal
        visible={openPosModal}
        onSelect={handleSelectPos}
        onCancel={() => setOpenPosModal(false)}
      />
    </>
  );
}
