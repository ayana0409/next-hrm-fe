import { FieldDef } from "@/types/table";
import { Form, Input } from "antd";

export function AutoFormFields({ fields }: { fields: FieldDef[] }) {
  return (
    <>
      {fields.map((f) => {
        const rules = f.required
          ? [{ required: true, message: `${f.title} is required` }]
          : undefined;
        return (
          <Form.Item key={f.key} name={f.key} label={f.title} rules={rules}>
            {f.inputType === "textarea" ? (
              <Input.TextArea placeholder={f.placeholder} />
            ) : (
              <Input placeholder={f.placeholder} />
            )}
          </Form.Item>
        );
      })}
    </>
  );
}
