"use server";
import { createBaseApi } from "@/components/crud/base.api";

const userApi = createBaseApi("user");

export async function getAllUser(params?: any) {
  return await userApi.getAll(params);
}

export async function handleAdd(data: any) {
  if (String(data.password) !== String(data.confirmedPassword)) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }
  delete data.confirmedPassword;
  await userApi.create(data);
}
export async function handleEdit(id: string | number, data: any) {
  delete data.confirmedPassword;
  await userApi.update(String(id), data);
}

export async function handleDelete(id: string | number) {
  await userApi.delete(String(id));
}
