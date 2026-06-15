import { FilterField } from "@/components/shared/filters/types";

export const patientFilters: FilterField[] = [
  {
    field: "category",
    label: "Category",

    options: [
      {
        label: "All Categories",
        value: "ALL",
      },
      {
        label: "Regular",
        value: "REGULAR",
      },
      {
        label: "Insurance",
        value: "INSURANCE",
      },
      {
        label: "New",
        value: "NEW",
      },
      {
        label: "Child",
        value: "CHILD",
      },
      {
        label: "Senior",
        value: "SENIOR",
      },
    ],
  },
  {
    field: "status",
    label: "Status",

    options: [
      {
        label: "All Status",
        value: "ALL",
      },
      {
        label: "Active",
        value: "ACTIVE",
      },
      {
        label: "Inactive",
        value: "INACTIVE",
      },
      {
        label: "Blacklisted",
        value: "BLACKLISTED",
      },
    ],
  },
  {
    field: "gender",
    label: "Gender",

    options: [
      {
        label: "All Genders",
        value: "ALL",
      },
      {
        label: "Male",
        value: "MALE",
      },
      {
        label: "Female",
        value: "FEMALE",
      },
      {
        label: "Other",
        value: "OTHER",
      },
    ],
  },
  {
    field: "blood_group",
    label: "Blood Group",

    options: [
      {
        label: "All Groups",
        value: "ALL",
      },
      {
        label: "A+",
        value: "A+",
      },
      {
        label: "A-",
        value: "A-",
      },
      {
        label: "B+",
        value: "B+",
      },
      {
        label: "B-",
        value: "B-",
      },
      {
        label: "AB+",
        value: "AB+",
      },
      {
        label: "AB-",
        value: "AB-",
      },
      {
        label: "O+",
        value: "O+",
      },
      {
        label: "O-",
        value: "O-",
      },
    ],
  },
];
