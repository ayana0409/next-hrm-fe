"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import DeleteDepartmentButton from "./deleteDepartment";
import EditDepartmentButton from "./editDepartment";
import CreateDepartmentButton from "./createDepartment";
import { TableProps } from "@/types/table";
import { useAxiosAuth } from "@/utils/customHook";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { DEPARTMENT_ENDPOINT, DEPARTMENT_FIELDS } from "./department.const";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";

const columns = fieldsToColumns(fieldsToArray(DEPARTMENT_FIELDS));
export default function DepartmentTable({ filters }: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth
      .get(DEPARTMENT_ENDPOINT, { params: filters })
      .then((res) => {
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

    dispatch(stopLoading());
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
      <CreateDepartmentButton />
      <CrudTable
        columns={columns}
        items={data?.items}
        meta={data?.meta}
        actions={(record) => (
          <>
            <EditDepartmentButton record={record} />
            <DeleteDepartmentButton id={record._id} />
          </>
        )}
      />
    </div>
  );
}
