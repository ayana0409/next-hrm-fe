import { Rule } from "antd/es/form";

export type CrudConfig<T> = {
  entity: string;
  columns: any[];
};
