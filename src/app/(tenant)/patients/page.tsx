"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { Users, LayoutGrid, Loader } from "lucide-react";

import PatientDataTable from "@/components/patients/PatientDataTable";
import PatientFormSheet from "@/components/patients/PatientFormSheet";

import PageHeader from "@/components/shared/page/PageHeader";
import { EmptyState } from "@/components/shared/page/EmptyState";

import FilterPanel from "@/components/shared/filters/FilterPanel";
import { useFilters } from "@/components/shared/filters/useFilters";
import { patientFilters } from "@/types/patients";

import { usePatients } from "@/hooks/patients/use-patients";
import { getApiError } from "@/lib/utils/get-api-error";

const PatientsPage = () => {
  const { data, isLoading, error } = usePatients({limit: 20});

  const patients = data?.items ?? [];

  const { filters, update, reset } = useFilters({
    category: "ALL",
    status: "ALL",
    gender: "ALL",
    blood_group: "ALL",
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (filters.category !== "ALL" && p.category !== filters.category)
        return false;

      if (filters.status !== "ALL" && p.status !== filters.status) return false;

      if (filters.gender !== "ALL" && p.gender !== filters.gender) return false;

      if (
        filters.blood_group !== "ALL" &&
        p.blood_group !== filters.blood_group
      )
        return false;

      return true;
    });
  }, [patients, filters]);

  useEffect(() => {
    if (!error) return;
    toast.error(
        getApiError(
            error
        ))
  }, [error]);

  if (isLoading) {
    return (
        <EmptyState
            icon={Loader}
            title="Loading"
            description=""
        />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load patients"
        description={(error as any)?.body?.detail ?? "Unexpected error"}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-400 mx-auto p-1">
      {/* Page Header */}
      <PageHeader
        title="Patient Registry"
        description={`Total Registry: ${filteredPatients.length} records`}
        icon={Users}
        actions={<PatientFormSheet />}
      />

      {/* Filter Interactive Segment */}
      <FilterPanel
        fields={patientFilters}
        values={filters}
        onChange={update}
        onReset={reset}
      />

      {/* Core Table View Structure */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <LayoutGrid className="h-3.5 w-3.5" />
          Registry Records Ledger Output
        </div>
        <PatientDataTable data={filteredPatients} />
      </div>

      {!isLoading && filteredPatients.length === 0 && (
        <EmptyState title="No patients found" description="Adjust filters" />
      )}
    </div>
  );
};

export default PatientsPage;
