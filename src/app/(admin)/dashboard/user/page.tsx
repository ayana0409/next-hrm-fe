import UserTable from "@/components/admin/user.table";
import { sendRequest } from "@/utils/api";
import React from "react";

interface IProp {
  params: { id: string };
  searchParam: { [key: string]: string | string[] | undefined };
}

const ManageUserPage = async () => {
  //   const current = props?.searchParam.current ?? 1;
  //   const pageSize = props?.searchParam.pageSize ?? 10;

  return (
    <div>
      <UserTable />
    </div>
  );
};

export default ManageUserPage;
