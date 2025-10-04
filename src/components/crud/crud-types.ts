import { Rule } from "antd/es/form";

export type CrudField = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "date" | "password";
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
};

export type CrudConfig<T> = {
  entity: string;
  columns: any[];
  fields: CrudField[];
  api?: {
    getAll: (params: any) => Promise<{ items: T[]; meta: any }>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
};
