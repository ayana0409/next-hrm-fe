import UserTable from "@/components/admin/user.table";
import { axiosWithSession } from "@/library/axiosWithSession";
import React from "react";

interface IProp {
  params: { id?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ManageUserPage = async ({ params, searchParams }: IProp) => {
  const current = searchParams?.current ?? "1";
  const pageSize = searchParams?.pageSize ?? "1";
  const api = await axiosWithSession();

  const res = await api.get("user", {
    params: {
      current,
      pageSize,
    },
  });

  console.log("res", res);

  return (
    <div>
      <UserTable
        users={res.data.items}
        meta={{
          current: res.data.current,
          pageSize: res.data.pageSize,
          pages: res.data.totalPage,
          totalItem: res.data.totalItem,
        }}
      />
    </div>
  );
};

export default ManageUserPage;
