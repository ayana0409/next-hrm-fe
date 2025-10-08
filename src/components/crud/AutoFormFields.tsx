import { FieldDef } from "@/types/table";
import { Checkbox, DatePicker, Form, Input, InputNumber, Select } from "antd";

export function AutoFormFields({ fields }: { fields: FieldDef[] }) {
  return (
    <>
      {fields.map((f) => {
        const rules = f.required
          ? [{ required: true, message: `${f.title} is required` }]
          : undefined;

        const itemProps =
          f.inputType === "checkbox"
            ? { valuePropName: "checked" as const }
            : undefined;

        return (
          <Form.Item
            key={f.key}
            name={f.key}
            label={f.title}
            rules={rules}
            {...itemProps}
          >
            {(() => {
              switch (f.inputType) {
                case "textarea":
                  return (
                    <Input.TextArea
                      placeholder={f.placeholder}
                      rows={f.rows ?? 4}
                    />
                  );

                case "number":
                  return (
                    <InputNumber
                      placeholder={f.placeholder}
                      style={{ width: "100%" }}
                      min={f.min ?? 0}
                      max={f.max}
                    />
                  );

                case "select":
                  return (
                    <Select
                      placeholder={f.placeholder}
                      options={f.options ?? []}
                      allowClear={f.allowClear ?? true}
                      style={{ width: "100%" }}
                    />
                  );

                case "date":
                  return <DatePicker style={{ width: "100%" }} />;

                case "checkbox":
                  return <Checkbox>{f.checkboxLabel ?? f.title}</Checkbox>;

                // case "custom":
                //   return f.render ? f.render() : null;

                case "input":
                default:
                  return <Input placeholder={f.placeholder} />;
              }
            })()}
          </Form.Item>
        );
      })}
    </>
  );
}
