import { axiosWithSession } from "@/library/axiosWithSession";
import { ApiError } from "next/dist/server/api-utils";

export function createBaseApi(endpoint: string) {
  return {
    async getAll(params?: any) {
      const api = await axiosWithSession();
      const res = await api.get(endpoint, { params });
      return {
        items: res.data.items,
        meta: {
          current: res.data.current,
          pageSize: res.data.pageSize,
          pages: res.data.totalPage,
          totalItem: res.data.totalItem,
        },
      };
    },
    async create(data: any) {
      try {
        const api = await axiosWithSession();
        const res = await api.post(endpoint, data);
        return { success: true, data: res.data };
      } catch (error: any) {
        throw new ApiError(
          error?.response?.data?.statusCode || 500,
          error?.response?.data?.message || "Internal Error"
        );
      }
    },

    async update(id: string, data: any) {
      try {
        const api = await axiosWithSession();
        const res = await api.patch(`${endpoint}/${id}`, data);
        return { success: true, data: res.data };
      } catch (error: any) {
        throw new ApiError(
          error?.response?.data?.statusCode || 500,
          error?.response?.data?.message || "Internal Error"
        );
      }
    },

    async delete(id: string) {
      try {
        const api = await axiosWithSession();
        const res = await api.delete(`${endpoint}/${id}`);
        return { success: true, data: res.data };
      } catch (error: any) {
        throw new ApiError(
          error?.response?.data?.statusCode || 500,
          error?.response?.data?.message || "Internal Error"
        );
      }
    },
  };
}
