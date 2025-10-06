"use server";
import { createBaseApi } from "@/components/crud/base.api";

const api = createBaseApi("position");

export async function getAll(params?: any) {
  return await api.getAll(params);
}

export async function handleAdd(data: any) {
  await api.create(data);
}
export async function handleEdit(id: string | number, data: any) {
  await api.update(String(id), data);
}

export async function handleDelete(id: string | number) {
  await api.delete(String(id));
}
