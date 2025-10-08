export interface TableProps {
  filters: any;
}

export type FieldDef = {
  title: string;
  key: string;
  dataIndex?: string;
  index: number;
  fixed?: boolean;
  inputType?: "input" | "textarea" | "number" | "select" | "date" | "checkbox";
  required?: boolean;
  placeholder?: string;
  width?: number;

  // for number type
  min?: number; // default: 0
  max?: number;

  // for textarea type
  rows?: number; // fefault: 4

  // for select type
  options?: any[];
  allowClear?: boolean;

  // for check box type
  checkboxLabel?: string;
};
