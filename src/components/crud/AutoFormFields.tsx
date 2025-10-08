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

                case "select": {
                  // Nếu options là mảng object dùng luôn,
                  // nếu là mảng string thì map sang { label, value },
                  // nếu là string (key) thì cố gắng lấy từ f.optionsMap nếu có
                  const raw = (f as any).options;
                  let opts: { label: string; value: any }[] = [];

                  if (Array.isArray(raw)) {
                    opts =
                      raw.length && typeof raw[0] === "object"
                        ? (raw as { label: string; value: any }[])
                        : (raw as string[]).map((v) => ({
                            label:
                              String(v).charAt(0).toUpperCase() +
                              String(v).slice(1),
                            value: v,
                          }));
                  } else if (
                    typeof raw === "string" &&
                    (f as any).optionsMap &&
                    typeof (f as any).optionsMap === "object"
                  ) {
                    const mapped = (f as any).optionsMap[raw];
                    if (Array.isArray(mapped)) {
                      opts =
                        mapped.length && typeof mapped[0] === "object"
                          ? mapped
                          : (mapped as string[]).map((v) => ({
                              label: String(v),
                              value: v,
                            }));
                    }
                  }

                  // fallback: nếu không có options hợp lệ thì rỗng
                  return (
                    <Select
                      placeholder={f.placeholder}
                      options={opts}
                      allowClear={f.allowClear ?? true}
                      style={{ width: "100%" }}
                    />
                  );
                }

                case "date":
                  return <DatePicker style={{ width: "100%" }} />;

                case "checkbox":
                  return <Checkbox>{f.checkboxLabel ?? f.title}</Checkbox>;

                case "password":
                  return <Input.Password placeholder={f.placeholder} />;

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
