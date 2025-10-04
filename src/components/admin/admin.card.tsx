"use client";

import { Button, Card, Col, message, Row } from "antd";

const AdminCard = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      <Button onClick={() => messageApi.error("Lỗi test!")}>Test Toast</Button>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Card title" variant={"borderless"}>
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" variant={"borderless"}>
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" variant={"borderless"}>
            Card content
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminCard;
