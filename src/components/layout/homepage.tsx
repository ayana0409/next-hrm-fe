"use client"; // Nếu dùng App Router
import api from "@/utils/api";
import { Button, Image, message, Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";

interface AttendanceResponse {
  success: boolean;
  employeeId: string;
  fullName: string;
  action?: string;
}

const WebcamAttendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null); // Ảnh capture tạm thời
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  // Hàm capture ảnh từ webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot(); // Trả về base64
    if (imageSrc) {
      setImgSrc(imageSrc);
      sendToBackend(imageSrc); // Gửi ngay lập tức
    }
  }, []);

  // Gửi ảnh base64 đến NestJS API
  const sendToBackend = async (imageBase64: string) => {
    dispatch(startLoading());
    await api
      .post("attendance/image", {
        image: imageBase64,
      })
      .then((response) => {
        const data = response.data as AttendanceResponse;
        if (data.success) {
          msg.success(`Chấm công thành công cho user: ${data.fullName}`, 3);
          // Hiển thị thông báo UI (e.g., toast)
        } else {
          msg.warning(`${data.fullName} đã check out hôm nay`, 3);
        }
      })
      .catch((error) => {
        if (error.response.data.statusCode === 400) {
          msg.warning("No face detected", 3);
          return;
        }
        if (error.response.data.statusCode === 404) {
          msg.warning("No employee match", 3);
          return;
        }
        console.error("Lỗi gửi ảnh:", error.response.data);
        msg.error("Internal server error", 3);
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  // Bắt đầu capture định kỳ (mỗi 5 giây)
  const startPeriodicCapture = () => {
    if (isCapturing || intervalId) return;
    setIsCapturing(true);
    const id = setInterval(capture, 10000); // 5 giây/lần
    setIntervalId(id);
  };

  // Dừng capture
  const stopPeriodicCapture = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsCapturing(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup khi component unmount
    };
  }, [intervalId]);

  return (
    <div className="p-8 m-8">
      {contextHolder}
      <Title level={2} className="text-center uppercase">
        chấm công bằng khuôn mặt
      </Title>
      <div className="text-center">
        <Button type="primary" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </Button>
      </div>
      <div className="flex justify-center items-center p-2">
        {!isPreview || (
          <div className="flex flex-row gap-4 flex-wrap md:flex-nowrap w-full max-w-[1280px]">
            {/* Bên trái: để trống hoặc thêm danh sách sau */}
            <div className="w-full md:w-1/3">
              <Title level={4} className="text-center">
                Danh sách
              </Title>
              {/* Bạn có thể thêm nội dung vào đây sau */}
            </div>

            {/* Bên phải: ảnh chụp chiếm 2/3 */}
            <div className="w-full md:w-2/3">
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
                className="rounded-lg border-4 border-emerald-600 p-1 w-full h-[480px] object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-center p-2">
        <Button color="danger" variant="solid" onClick={capture}>
          Chụp Ngay
        </Button>
      </div>
      <div className="text-center p-2">
        <Space>
          <Button onClick={startPeriodicCapture} disabled={isCapturing}>
            Auto (10s)
          </Button>
          <Button onClick={stopPeriodicCapture} disabled={!isCapturing}>
            Dừng
          </Button>
        </Space>
      </div>

      <Title level={5} className="text-center uppercase">
        Trạng thái: {isCapturing ? "Đang capture..." : "Dừng"}
      </Title>
    </div>
  );
};

export default WebcamAttendance;
