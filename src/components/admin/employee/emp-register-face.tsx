import { useAxiosAuth } from "@/utils/customHook";
import { message, Tooltip, Modal, Steps, Button, theme } from "antd";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Title from "antd/es/typography/Title";
import { CameraOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";

const steps = [
  {
    title: "Frontal view",
    content: "Capture the frontal view of the face.",
    previewUrl: "/images/register-face/frontal-view.png",
  },
  {
    title: "Left profile",
    content: "Capture the left profile for biometric analysis.",
    previewUrl: "/images/register-face/right-profile.png",
  },
  {
    title: "Right profile",
    content: "Ensure the right profile is clearly visible.",
    previewUrl: "/images/register-face/left-profile.png",
  },
];

export default function EmpFaceRegisterDetail({
  employeeId,
}: {
  employeeId: string;
}) {
  const axiosAuth = useAxiosAuth();
  const [open, setOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const dispatch = useDispatch();

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1280,
      height: 720,
    }); // Trả về base64
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, []);

  const sendToBackend = async () => {
    dispatch(startLoading());
    await axiosAuth
      .post("/employee/register-face", {
        employeeId,
        image: imgSrc,
      })
      .then(() => {
        msg.success(`Đăng ký khuôn mặt thành công`, 3);
        next();
        setImgSrc(null);
      })
      .catch((error: any) => {
        if (error.response.data.statusCode === 400) {
          msg.warning("No face detected", 3);
          return;
        }
        console.error("Lỗi gửi ảnh:", error);
        msg.error("Lỗi hệ thống");
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  const next = () => {
    if (current === steps.length - 1) {
      setOpen(false);
      msg.success("Registing face success", 3);
      setCurrent(0);
      return;
    }
    setCurrent(current + 1);
  };

  return (
    <div className="w-full">
      {contextHolder}
      <Tooltip title="Registing face" className="m-2">
        <button
          onClick={() => {
            setOpen(true);
          }}
          aria-label="Edit"
          className="bg-blue-400 text-white hover:bg-blue-800 rounded px-3 py-1 transition shadow-sm"
        >
          <SmileOutlined />
        </button>
      </Tooltip>
      <Modal
        title="Registing Employee Face"
        footer={null}
        open={open}
        onOk={() => setOpen(false)}
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
        {" "}
        <Steps current={current} items={items} className="p-4" />
        <div className="w-full text-xl text-center p-2 font-bold">
          {steps[current].content}
        </div>
        <div className="flex flex-row gap-4 flex-wrap md:flex-nowrap w-full max-w-[1280px]">
          <div className="w-full md:w-1/2">
            <Title level={4} className="text-center">
              Live
            </Title>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              className="rounded-lg border-4 border-emerald-600 p-1 w-full h-[480px] object-cover scale-x-[-1]"
            />
            <Tooltip title="Capture">
              {" "}
              <div className="text-center pt-2">
                <Button color="danger" variant="solid" onClick={capture}>
                  <CameraOutlined />
                </Button>
              </div>
            </Tooltip>
          </div>
          <div className="w-full md:w-1/2">
            <Title level={4} className="text-center">
              Preview
            </Title>
            <img
              src={imgSrc || steps[current].previewUrl}
              alt="Preview"
              className="rounded-lg border-4 border-red-600 p-1 w-full h-[480px] object-cover scale-x-[-1]"
            />
            <Tooltip title="Upload">
              {" "}
              <div className="text-center pt-2">
                <Button color="blue" variant="solid" onClick={sendToBackend}>
                  <SendOutlined />
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </div>
  );
}
