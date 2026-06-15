"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;

  title: string;
  className?: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];

  columns: Column<T>[];
  empty?: ReactNode;
  rowKey: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  empty,
}: DataTableProps<T>) {
  if (!data.length) {
    return empty;
  }

  return (
    <Card className="overflow-hidden rounded-2xl p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.className}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((column) => {
                  const value = row[column.key as keyof T];

                  return (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "-")}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
