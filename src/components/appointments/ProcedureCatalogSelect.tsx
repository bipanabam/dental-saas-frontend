"use client";

import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

import {
  useSearchProcedureCatalog,
  useProcedureCatalogs,
} from "@/hooks/procedure-catalog/use-procedure-catalog";

type Props = {
  value?: string;

  onChange: (procedure: any) => void;
};

export default function ProcedureCatalogSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isSearching = search.length >= 2;

  const { data: searchData, isLoading: isSearchLoading } =
    useSearchProcedureCatalog(search);
  const { data: listData, isLoading: isListLoading } = useProcedureCatalogs({
    limit: 20,
  });

  const procedures: any[] = isSearching ? (searchData ?? []) : (listData ?? []);
  const isLoading = isSearching ? isSearchLoading : isListLoading;

  const selected = procedures.find((x: any) => x.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          {selected?.name ?? "Search procedure"}

          <ChevronsUpDown
            className="h-4 w-4"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-105 p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search procedure..."
          />

          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No procedures"}
            </CommandEmpty>

            {procedures.map((item: any) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => {
                  onChange(item);

                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>{item.name}</span>

                  <span className="text-xs text-muted-foreground">
                    Rs {item.default_cost}
                    {" · "}
                    {item.default_duration_minutes}
                    min
                  </span>
                </div>

                {value === item.id && <Check />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
