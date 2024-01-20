"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { HeartsParticipantWithStats } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function HeartsDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'percentageWon', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filteredData, setFilteredData] = React.useState<TData[]>(data);
  const [minGamesPlayed, setMinGamesPlayed] = React.useState('');

  const handleMinGamesPlayedChange = (value: string) => {
    setMinGamesPlayed(value);
    if (value === '') {
      // If the input is empty, remove the filter
      setColumnFilters(old => old.filter(filter => filter.id !== 'gamesPlayed'));
    } else {
      // Otherwise, parse the value and set the filter
      const numericValue = parseInt(value, 10);
      setColumnFilters([{ id: 'gamesPlayed', value: numericValue }]);
    }
  };

  const greaterThanFilter: FilterFn<HeartsParticipantWithStats> = (row, columnId, filterValue) => {
    const cellValue = row.getValue(columnId) as number; // Assuming the cell value is a number
    const filterNumber = Number(filterValue);
    return cellValue >= filterNumber;
  };

  const handleResetFilters = () => {
    setColumnFilters([]);
    setSorting([
      { id: 'percentageWon', desc: true }
    ]);
    setFilteredData(data); // Reset the filtered data to the original data
    setMinGamesPlayed('');
  }

  const rankColumn: ColumnDef<TData, TValue> = {
    id: 'rank',
    header: 'Win % Rank',
    cell: (info) => <span>{info.row.index + 1}</span>,
  };

  const columnsWithRank: ColumnDef<TData, TValue>[] = [rankColumn, ...columns];

  const table = useReactTable({
    data: filteredData,
    columns: columnsWithRank,
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

  React.useEffect(() => {
    if (columnFilters.length > 0) {
      setFilteredData(table.getRowModel().rows.map(row => row.original));
    } else {
      setFilteredData(data); // Reset to original data when filters are cleared
    }
  }, [columnFilters, data, table]);

  return (
    <div>
      <div className="flex items-center mb-6 justify-between">
        <Input
          type="number"
          className="max-w-sm"
          value={minGamesPlayed}
          onChange={(e) => handleMinGamesPlayedChange(e.target.value)}
          placeholder="Filter for Min. Games Played"
          min={0}
        />
        <Button variant={"outline"} onClick={handleResetFilters}>Reset Table</Button>
      </div>
      <div className="rounded-md border">
        <Table className="">
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

