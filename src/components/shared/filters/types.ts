export interface FilterOption {
  label: string
  value: string
}

export type FilterFieldType = "select" | "async-select" | "date-range";

export interface FilterField {
  field: string
  label: string

  type?: FilterFieldType; // defaults to "select"

  placeholder?: string
  options: FilterOption[]
  width?: string
}