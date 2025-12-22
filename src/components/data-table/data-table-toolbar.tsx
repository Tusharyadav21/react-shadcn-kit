"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  placeholder?: string;
  enableGlobalFilter?: boolean;
  facetedFilters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  placeholder,
  enableGlobalFilter,
  facetedFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const globalFilter = table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {enableGlobalFilter ? (
          <Input
            placeholder={placeholder ?? "Search..."}
            value={(globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : searchKey ? (
          <Input
            placeholder={placeholder ?? "Filter..."}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : null}

        {facetedFilters?.map(
          (filter) =>
            table.getColumn(filter.columnId) && (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.title}
                options={filter.options}
              />
            ),
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
