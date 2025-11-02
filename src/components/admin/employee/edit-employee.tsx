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
import { AutoFormFields } from "@/components/crud/AutoFormFields";
import { fieldsToArray } from "@/utils/fields";
import { EditFilled } from "@ant-design/icons";
import { EMPLOYEE_FIELDS, EMPLOYEE_ROUTE } from "./employee.const";
import { DepartmentSelectModal } from "../department/select-department.modal";
import { PositionSelectModal } from "../position/select-position.modal";
import { SelectedPosition } from "@/types/position";
import { SelectedDepartment } from "@/types/department";

export default function EditEmployeeButton({
  record,
  onUpdated,
}: {
  record: any;
  onUpdated: () => void;
}) {
  const [openDepModal, setOpenDepModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<SelectedDepartment>({
      id: record?.department?._id || record?.department?.id || "",
      name: record?.department?.name || "",
    });

  const [openPosModal, setOpenPosModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<SelectedPosition>({
    id: record?.position?._id || record?.position?.id || "",
    title: record?.position?.title || "",
    level: record?.position?.level || "",
  });
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();

  const fieldList = fieldsToArray(EMPLOYEE_FIELDS, false, true);
  const [form] = Form.useForm();
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
        onUpdated();
      })
      .catch((error) => {
        msg.error(error?.response.data.message || "Update failed");
      });

    dispatch(stopLoading());
  };

  // Selecting Department
  const handleSelectDep = (department: SelectedDepartment) => {
    setSelectedDepartment(department);
    setOpenDepModal(false);
  };

  useEffect(() => {
    if (selectedDepartment?.id && form.getFieldInstance("departmentId")) {
      form.setFieldsValue({
        departmentId: selectedDepartment.id,
      });
    }
  }, [selectedDepartment]);

  // Selecting Postion
  const handleSelectPos = (position: SelectedPosition) => {
    setSelectedPosition(position);
    setOpenPosModal(false);
  };

  useEffect(() => {
    if (selectedPosition.id && form.getFieldInstance("positionId")) {
      form.setFieldsValue({
        positionId: selectedPosition.id,
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
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <EditFilled className="mr-2" />
        </button>
      </Tooltip>
      <Modal
        title="Update Employee"
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            positionId: selectedPosition?.id,
            departmentId: selectedDepartment.id,
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AutoFormFields fields={fieldList} />

            <Form.Item
              name="departmentId"
              rules={[{ required: true, message: "Department là bắt buộc" }]}
              style={{ display: "none" }}
            >
              <Input />
            </Form.Item>

            {/* Field hiển thị + lỗi */}
            <Form.Item shouldUpdate label="Department">
              {({ getFieldError }) => (
                <>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input disabled value={selectedDepartment?.name || ""} />
                    <Button
                      type="primary"
                      onClick={() => setOpenDepModal(true)}
                    >
                      Chose
                    </Button>
                  </Space.Compact>
                  <Form.ErrorList
                    errors={getFieldError("departmentId")}
                    className="text-red-500 text-sm"
                  />
                </>
              )}
            </Form.Item>

            {/* Hiển thị Position */}
            <Form.Item
              name="positionId"
              rules={[{ required: true, message: "Position là bắt buộc" }]}
              style={{ display: "none" }}
            >
              <Input />
            </Form.Item>

            {/* Field hiển thị + lỗi */}
            <Form.Item shouldUpdate label="Position">
              {({ getFieldError }) => (
                <>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      disabled
                      value={
                        selectedPosition
                          ? `${selectedPosition.title} - ${selectedPosition.level}`
                          : ""
                      }
                    />
                    <Button
                      type="primary"
                      onClick={() => setOpenPosModal(true)}
                    >
                      Chose
                    </Button>
                  </Space.Compact>
                  <Form.ErrorList
                    errors={getFieldError("positionId")}
                    className="text-red-500 text-sm"
                  />
                </>
              )}
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Terminated", value: "terminated" },
                ]}
              />
            </Form.Item>
          </div>
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
