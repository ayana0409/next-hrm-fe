"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./createUser";
import EditUserButton from "./editUser";
import DeleteUserButton from "./deleteUser";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/table";
import { USER_ENDPOINT, USER_FIELDS } from "./user.const";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Space } from "antd";

const columns = fieldsToColumns(fieldsToArray(USER_FIELDS, true));

export default function UserTable({ filters }: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();

  const fetchData = async () => {
    await axiosAuth.get(USER_ENDPOINT, { params: filters }).then((res) => {
      const { items, current, pageSize, pages, totalItem } = res.data.data;
      setData({
        items,
        meta: {
          current,
          pageSize,
          pages,
          totalItem,
        },
      });
    });
  };

  useEffect(() => {
    dispatch(startLoading());
    if (status === "authenticated" && session?.access_token) {
      fetchData();
      dispatch(stopLoading());
    }
  }, [status, session, filters]);
  return (
    <div>
      <CreateUserButton />
      <CrudTable
        columns={columns}
        items={data?.items}
        meta={data?.meta}
        actions={(record) => (
          <Space>
            <EditUserButton record={record} />
            <DeleteUserButton id={record._id} />
          </Space>
        )}
      />
    </div>
  );
}
