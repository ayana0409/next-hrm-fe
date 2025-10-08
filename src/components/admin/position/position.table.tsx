"use client";
import { TableProps } from "@/types/table";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import CreatePositionButton from "./createPosition";
import DeletePositionButton from "./deletePosition";
import EditPositionButton from "./editPosition";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const columns = fieldsToColumns(fieldsToArray(POSITION_FIELDS));

export default function PositionTable({ filters }: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();

  const fetchData = async () => {
    await axiosAuth.get(POSITION_ENDPOINT, { params: filters }).then((res) => {
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
      <CreatePositionButton />
      <CrudTable
        columns={columns}
        items={data?.items}
        meta={data?.meta}
        actions={(record) => (
          <>
            <EditPositionButton record={record} />
            <DeletePositionButton id={record._id} />
          </>
        )}
      />
    </div>
  );
}
