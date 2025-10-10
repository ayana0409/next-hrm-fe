import { FieldDef } from "@/types/table";
import { ColumnsType } from "antd/es/table";

export function makeFields<T extends Record<string, FieldDef>>(obj: T): T {
  const seen = new Set<string>();
  for (const name of Object.keys(obj)) {
    const f = obj[name as keyof T];
    if (!f.title || !f.key || typeof f.index !== "number") {
      throw new Error(`Invalid field definition for ${name}`);
    }
    if (seen.has(f.key)) {
      throw new Error(`Duplicate key ${f.key}`);
    }
    seen.add(f.key);
  }
  return obj;
}

export function fieldsToArray<T extends Record<string, FieldDef>>(
  fields: T,
  hidden?: boolean,
  notInput?: boolean
) {
  return Object.values(fields)
    .slice()
    .filter((f) => {
      // nếu hidden === true thì loại bỏ các field có f.hidden === true
      if (hidden)
        return !Boolean((f as FieldDef & { hidden?: boolean }).hidden);

      if (notInput)
        return !Boolean((f as FieldDef & { notInput?: boolean }).notInput);
      // nếu hidden không truyền hoặc false thì giữ tất cả
      return true;
    })
    .sort((a, b) => a.index - b.index) as FieldDef[];
}

export function fieldsToColumns(fields: FieldDef[]): ColumnsType<any> {
  return fields.map((f) => ({
    title: f.title,
    dataIndex: f.dataIndex ?? f.key,
    key: f.key,
    fixed: f.fixed,
    width: f.width,
  }));
}
