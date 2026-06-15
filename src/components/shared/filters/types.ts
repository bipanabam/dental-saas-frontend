export interface FilterOption {
  label: string
  value: string
}

export interface FilterField {
  field: string
  label: string

  placeholder?: string

  options: FilterOption[]

  width?: string
}