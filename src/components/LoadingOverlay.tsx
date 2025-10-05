"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin } from "antd";

export default function LoadingOverlay() {
  const { isLoading, message } = useSelector(
    (state: RootState) => state.loading
  );

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md shadow-lg flex flex-col items-center gap-2">
        <Spin size="large" />
        <p>{message}</p>
      </div>
    </div>
  );
}
