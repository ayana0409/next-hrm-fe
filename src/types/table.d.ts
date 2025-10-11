export interface TableProps {
  filters: any;
}

export type FieldDef = {
  title: string;
  key: string;
  dataIndex?: string[] | string;
  index: number;
  fixed?: boolean;
  required?: boolean;
  placeholder?: string;
  width?: number;
  responsive?: string[];
  render?: any;

  hidden?: boolean; // hidden on table
  notInput?: boolean; // hidden on form

  inputType?:
    | "input"
    | "textarea"
    | "number"
    | "select"
    | "date"
    | "checkbox"
    | "password";

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
