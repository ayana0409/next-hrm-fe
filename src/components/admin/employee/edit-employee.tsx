"use client";
import { Button, Form, Input, Modal, Space, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useDispatch } from "react-redux";
import { useAxiosAuth } from "@/utils/customHook";
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { fieldsToArray } from "@/utils/fields";
import { EditFilled } from "@ant-design/icons";
import { EMPLOYEE_FIELDS, EMPLOYEE_ROUTE } from "./employee.const";
import { DepartmentSelectModal } from "../department/select-department.modal";
import { PositionSelectModal } from "../position/select-position.modal";

export default function EditEmployeeButton({ record }: { record: any }) {
  const [openDepModal, setOpenDepModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{
    _id: string;
    name: string;
  }>(record.department);

  const [openPosModal, setOpenPosModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    _id: string;
    title: string;
    level: string;
  }>(record.position);
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();

  const fieldList = fieldsToArray(EMPLOYEE_FIELDS, false, true);
  const [form] = Form.useForm();

  const router = useRouter();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const onSubmit = async () => {
    const values = await form.validateFields();
    dispatch(startLoading());
    axiosAuth
      .patch(`${EMPLOYEE_ROUTE}/${record.id}`, values)
      .then(() => {
        msg.success("Update successul");
        setOpen(false);
        router.refresh();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
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
        positionId: selectedPosition._id,
      });
    }
  }, [selectedPosition]);

  return (
    <>
      {contextHolder}
      <Tooltip title="Edit" className="m-2">
        <button
          onClick={() => {
            form.setFieldsValue(record);
            setOpen(true);
            router.refresh();
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <EditFilled className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Update Department"
        open={open}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <AutoFormFields fields={fieldList} />

          <Form.Item label="Department">
            <Space.Compact style={{ width: "100%" }}>
              <Input disabled value={selectedDepartment?.name ?? ""} />
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
                  selectedPosition
                    ? selectedPosition?.title + " - " + selectedPosition?.level
                    : ""
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
