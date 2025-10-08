export interface TableProps {
  data: any[];
  meta: any;
  filters: any;
}

export type FieldDef = {
  title: string;
  key: string;
  dataIndex?: string;
  index: number;
  fixed?: boolean;
  inputType?: "input" | "textarea" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  width?: number;
};
