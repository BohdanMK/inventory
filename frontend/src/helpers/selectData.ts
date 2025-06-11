type Option = {
  name: string;
  code: string;
};

export default function toSelectOptions<T>(data: T[], labelKey: keyof T, valueKey: keyof T): Option[] {
  return data.map(item => ({
    name: String(item[labelKey]),
    code: String(item[valueKey]),
  }));
}
