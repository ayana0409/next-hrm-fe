"use client";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { authenticate } from "@/utils/actions";
import router from "next/router";
import { useState } from "react";

const Login = () => {
  const [error, setError] = useState("");
  const onFinish = async (values: { username: string; password: string }) => {
    const res = await authenticate(values.username, values.password);

    if (res?.error === "CredentialsSignin") {
      setError("Sai tài khoản hoặc mật khẩu");
    } else if (res?.error) {
      setError("Lỗi hệ thống");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng Nhập</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link href={"/"}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
        </fieldset>
      </Col>
    </Row>
  );
};

export default Login;
