"use client"

import { Input } from "@/components/ui/input"
import { ColumnDef, flexRender, getFilteredRowModel, ColumnFiltersState, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, FilterFn, Row, filterFns } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react"
import { Button } from "@/components/ui/button";
import { ParticipantWithStats } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const greaterThanFilter: FilterFn<ParticipantWithStats> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId) as number; // Assuming the cell value is a number
  const filterNumber = Number(filterValue);
  return cellValue >= filterNumber;
};

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const handleSetFilter = (value: number) => {
    setColumnFilters([{ id: 'gamesPlayed', value }])
  };

  const handleResetFilters = () => {
    setColumnFilters([])
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    },
    filterFns: {
      'greaterThan': greaterThanFilter,
    },
  });
  

  return (
    <div>
      <div className="flex items-center mb-6 gap-2">
        <Button onClick={() => handleSetFilter(5)}>5+ Games Played</Button>
        <Button onClick={() => handleSetFilter(10)}>10+ Games Played</Button>
        <Button variant={"outline"} onClick={handleResetFilters}>Reset Filters</Button>
      </div>
      <div className="rounded-md border">
        <Table className="text-lg">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
