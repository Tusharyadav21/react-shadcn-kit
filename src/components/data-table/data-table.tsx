"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  SortingState,
  VisibilityState,
  ColumnOrderState,
  RowPinningState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../primitives/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  onRowClick?: (row: Row<TData>) => void;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  enableRowExpansion?: boolean;

  enableColumnSizing?: boolean;
  enableColumnPinning?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnOrdering?: boolean;
  enableRowPinning?: boolean;
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

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onRowClick,
  renderSubComponent,
  enableRowExpansion = false,

  enableColumnSizing = false,
  enableColumnPinning = false,
  enableGlobalFilter = false,
  enableColumnOrdering = false,
  enableRowPinning = false,
  facetedFilters,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      ...(enableRowExpansion && { expanded }),

      ...(enableColumnSizing && { columnSizing }),
      ...(enableColumnPinning && { columnPinning }),
      ...(enableColumnOrdering && { columnOrder }),
      ...(enableRowPinning && { rowPinning }),
    },
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
    },
    enableRowSelection: true,
    ...(enableRowExpansion && { getExpandedRowModel: getExpandedRowModel() }),

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableRowExpansion && { onExpandedChange: setExpanded }),

    ...(enableColumnSizing && { onColumnSizingChange: setColumnSizing }),
    ...(enableColumnPinning && { onColumnPinningChange: setColumnPinning }),
    ...(enableColumnOrdering && { onColumnOrderChange: setColumnOrder }),
    ...(enableRowPinning && { onRowPinningChange: setRowPinning }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        enableGlobalFilter={enableGlobalFilter}
        facetedFilters={facetedFilters}
      />
      <div className="rounded-md border overflow-x-auto">
        <Table style={enableColumnSizing ? { minWidth: table.getTotalSize() } : undefined}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isPinned = enableColumnPinning ? header.column.getIsPinned() : false;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="relative"
                      style={{
                        width: enableColumnSizing ? `${header.getSize()}px` : undefined,
                        position: isPinned ? "sticky" : undefined,
                        left: isPinned === "left" ? `${header.column.getStart()}px` : undefined,
                        right: isPinned === "right" ? `${header.column.getAfter()}px` : undefined,
                        zIndex: isPinned ? 1 : undefined,
                        backgroundColor: isPinned ? "rgba(0, 0, 0, 0.02)" : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {enableColumnSizing && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-primary/50 ${
                            header.column.getIsResizing() ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? "cursor-pointer" : ""}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isPinned = enableColumnPinning ? cell.column.getIsPinned() : false;
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: enableColumnSizing ? `${cell.column.getSize()}px` : undefined,
                            position: isPinned ? "sticky" : undefined,
                            left: isPinned === "left" ? `${cell.column.getStart()}px` : undefined,
                            right: isPinned === "right" ? `${cell.column.getAfter()}px` : undefined,
                            zIndex: isPinned ? 1 : undefined,
                            backgroundColor: isPinned ? "rgba(0, 0, 0, 0.02)" : undefined,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {enableRowExpansion && row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        {renderSubComponent ? renderSubComponent({ row }) : null}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
      <DataTablePagination table={table} />
    </div>
  );
}
