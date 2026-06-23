"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import {
  Users, 
  LayoutGrid, 
  Loader,
  UserPlus,
  Activity,
  ShieldAlert,
  Asterisk
} from "lucide-react";

import PatientFormSheet from "@/components/patients/PatientFormSheet";

import PageHeader from "@/components/shared/page/PageHeader";
import { EmptyState } from "@/components/shared/page/EmptyState";

import FilterPanel from "@/components/shared/filters/FilterPanel";
import { useFilters } from "@/components/shared/filters/useFilters";
import { patientFilters } from "@/types/patients";
import AnalyticsCard from "@/components/shared/analytics/AnalyticsCard";
import AnalyticsGrid from "@/components/shared/analytics/AnalyticsGrid";
import { SectionLoader } from "@/components/base/loading-view";

import {
  DataTable,
} from "@/components/shared/data-table/DataTable";
import DataTableEmpty from "@/components/shared/data-table/DataTableEmpty";

import { patientColumns } from "@/components/patients/patient-columns";

import { usePatients } from "@/hooks/patients/use-patients";
import type { 
  PatientStatusEnum, 
  PatientCategoryEnum, 
  GenderEnum, 
  BloodGroupEnum 
} from "@/lib/api";
import { getApiError } from "@/lib/utils/get-api-error";


const PatientsPage = () => {
  const {
    filters,
    update,
    reset,
  } = useFilters({
    category: "ALL",
    status: "ALL",
    gender: "ALL",
    blood_group: "ALL",
  });

  const {
    data: allPatients,
    isLoading: activeLoading,
  } = usePatients({
    limit: 20,
      });

  const {
    data: filteredPatients,
    isLoading: filteredDataLoading,
    isFetching,
    error,
  } = usePatients({
    limit: 20,

    category: filters.category !== "ALL" ? filters.category as PatientCategoryEnum : undefined,
    status: filters.status !== "ALL" ? filters.status as PatientStatusEnum: undefined ,
    gender: filters.gender !== "ALL" ? filters.gender as GenderEnum : undefined,
    blood_group: filters.blood_group !== "ALL" ? filters.blood_group as BloodGroupEnum : undefined,
  });

  const patients =
    filteredPatients?.items ?? [];

  useEffect(() => {
    if (!error) return;
    toast.error(
      getApiError(
        error
      ))
  }, [error]);

  if (activeLoading) {
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
        description="Centralized database for clinical health records and patient administration."
        icon={Users}
        actions={<PatientFormSheet />}
      />

      {/* Analytics */}
      <AnalyticsGrid>
        <AnalyticsCard
          title="Total Patients"
          value={allPatients?.total ?? 0}
          icon={Users}
          trend={{
            value: "+2.4%",
            direction: "up",
          }}
          description="vs last month"
        />
        <AnalyticsCard
          title="New This Month"
          value={342}
          icon={UserPlus}
          trend={{
            value: "12 today",
            direction: "up",
          }}
        />
        <AnalyticsCard
          title="Active Patients"
          value={221}
          icon={Activity}
          description="Currently in treatment"
        />
        <AnalyticsCard
          title="Emergency"
          value={12}
          icon={Asterisk}
          description="Action required"
          priority="critical"
        />
        <AnalyticsCard
          title="Flagged"
          value={12}
          icon={ShieldAlert}
          trend={{
            value: "-3",
            direction: "down",
          }}
          priority="high"
        />
      </AnalyticsGrid>

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
        <div className="relative">

          <DataTable
            data={patients}
            columns={patientColumns}
            rowKey={(p) => p.id}
            empty={
              <>
              { isFetching ? (
                <SectionLoader message="" />
              ) :
                <DataTableEmpty
                  title="No patients found"
                  description="Adjust filters"
                />
              }
              </>
            }
          />
        </div>
      </div>

      {/* {!isLoading && filteredPatients.length === 0 && (
        <EmptyState title="No patients found" description="Adjust filters" />
      )} */}
    </div>
  );
};

export default PatientsPage;
