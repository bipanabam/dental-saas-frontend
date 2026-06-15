"use client";

import { useState } from "react";

export function useFilters(initial: Record<string, string>) {
  const [filters, setFilters] = useState(initial);

  function update(
    field: string,
    value: string,
  ) {
    setFilters((prev) => ({
      ...prev,

      [field]: value,
    }));
  }

  function reset() {
    setFilters(initial);
  }

  return {
    filters,
    update,
    reset,
  };
}
