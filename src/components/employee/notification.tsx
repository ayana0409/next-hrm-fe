import React, { useEffect, useState } from "react";
import {
  Modal,
  List,
  Button,
  Badge,
  Typography,
  Space,
  Tag,
  Pagination,
  message,
} from "antd";
import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useAxiosAuth, useNotificationSocket } from "@/utils/customHook";
import { NOTIFICATION_ENDPOINT } from "../admin/notification/notificaton.const";
import { PagingResponse } from "../crud/crud-types";

const { Text } = Typography;

const NotificationModal: React.FC = () => {
  const axiosAuth = useAxiosAuth();
  const { data: session, status } = useSession();
  const [msg, contextHolder] = message.useMessage();

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>({
    pageSize: 10,
    current: 1,
  });

  const fetchData = () => {
    axiosAuth
      .get(`${NOTIFICATION_ENDPOINT}/paged`, {
        params: {
          ...filters,
          userId: (session?.user as any).id,
        },
      })
      .then((res: any) => {
        const { items, current, pageSize, pages, totalItem } = res.data.data;
        setData({
          items,
          meta: { current, pageSize, pages, totalItem },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const markAllAsRead = () => {
    // setNotifications((prev) =>
    //   prev.map((n) => ({
    //     ...n,
    //     read: true,
    //   }))
    // );
  };

  const markAsRead = async (_id: string) => {
    const targetItem = data?.items.find((item) => item._id === _id);
    if (!targetItem || targetItem.read) return;

    const updatedItem = { ...targetItem, read: true };
    await axiosAuth.patch(`${NOTIFICATION_ENDPOINT}/${_id}/read`);

    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((item) =>
          item._id === _id ? updatedItem : item
        ),
      };
    });
  };

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, filters]);

  useNotificationSocket((session?.user as any)?.id ?? undefined, (message) => {
    msg.info(message, 3);
    fetchData();
  });

  return (
    <div className="pr-8">
      {contextHolder}
      <Badge
        count={data?.items.filter((n) => !n.read).length}
        size="small"
        hidden={!(status === "authenticated" && (session.user as any).id)}
      >
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20 }} />}
          onClick={handleOpen}
        />
      </Badge>

      <Modal
        title="Thông báo"
        open={visible}
        onCancel={handleClose}
        footer={[
          <Button key="mark" onClick={markAllAsRead}>
            Đánh dấu đã đọc tất cả
          </Button>,
          <Button key="close" type="primary" onClick={handleClose}>
            Đóng
          </Button>,
        ]}
      >
        <div className="overflow-y-auto max-h-96">
          <List
            itemLayout="horizontal"
            dataSource={data?.items}
            locale={{ emptyText: "Không có thông báo nào." }}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: item.read ? "#fafafa" : "#e6f7ff",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 8,
                }}
                onMouseEnter={() => markAsRead(item._id)}
              >
                <Space direction="vertical" className="w-full">
                  <Space align="center" className="w-full justify-between">
                    <Text strong={!item.read}>{item.message}</Text>
                    {item.type && (
                      <Tag
                        color={
                          item.type === "success"
                            ? "green"
                            : item.type === "error"
                            ? "red"
                            : item.type === "warning"
                            ? "orange"
                            : "blue"
                        }
                      >
                        {item.type.toUpperCase()}
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text className="text-sm" type="secondary">
                      {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                    </Text>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </div>
        <Pagination
          current={data?.meta.current}
          pageSize={data?.meta.pageSize}
          total={data?.meta.totalItem}
          pageSizeOptions={["10", "20", "50", "100"]}
          showSizeChanger
          onChange={(page, pageSize) => {
            setFilters((prev: any) => ({
              ...prev,
              current: page,
              pageSize,
            }));
          }}
          className="flex justify-center"
        />
      </Modal>
    </div>
  );
};

export default NotificationModal;
