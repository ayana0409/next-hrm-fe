"use server";
import { createBaseApi } from "@/components/crud/base.api";

const api = createBaseApi("department");

export async function getAllDepartment(params?: any) {
  return await api.getAll(params);
}

export async function handleAdd(data: any) {
  if (String(data.password) !== String(data.confirmedPassword)) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }
  delete data.confirmedPassword;
  await api.create(data);
}
export async function handleEdit(id: string | number, data: any) {
  delete data.confirmedPassword;
  await api.update(String(id), data);
}

export async function handleDelete(id: string | number) {
  await api.delete(String(id));
}
