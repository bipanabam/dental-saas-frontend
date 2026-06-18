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
        label: "Vip",
        value: "VIP",
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

export const ACTION_PERMISSIONS = {
  edit_patient: "patients.update",
  delete_patient: "patients.delete",
  restore_patient: "patients.update",
  assign_doctor: "patients.update",
  print_patient: "patients.read",
} as const;

export const useHasPermission = (userPermissions: string[]) => {
  return (permission: string) =>
    userPermissions.includes("*") || userPermissions.includes(permission);
};