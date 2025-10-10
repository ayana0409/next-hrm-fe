"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin } from "antd";
import { createPortal } from "react-dom";

export default function LoadingOverlay() {
  const { isLoading, message } = useSelector(
    (state: RootState) => state.loading
  );

  if (!isLoading) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.56)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        backdropFilter: "saturate(120%) blur(6px)",
        WebkitBackdropFilter: "saturate(120%) blur(6px)",
        transition: "opacity 180ms ease",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), #ffffff)",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(2,6,23,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          minWidth: 200,
          maxWidth: "min(90vw, 420px)",
        }}
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: 72,
            height: 72,
            borderRadius: 36,
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(37,99,235,0.06))",
          }}
        >
          <Spin
            size="large"
            style={{ color: "#4f46e5", fontSize: 36, display: "block" }}
            tip={undefined}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 16 }}>
            {message || "Vui lòng chờ"}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#586173" }}>
            Đang xử lý yêu cầu của bạn...
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
