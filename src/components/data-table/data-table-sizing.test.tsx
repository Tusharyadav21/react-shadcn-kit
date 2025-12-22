import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";

type TestData = {
  id: string;
  name: string;
};

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

const data: TestData[] = [{ id: "1", name: "Test" }];

describe("DataTable Sizing", () => {
  it("applies min-width when enableColumnSizing is true", () => {
    render(<DataTable columns={columns} data={data} enableColumnSizing={true} />);

    // The table is inside a div with overflow-x-auto, but we want to check the table element itself.
    // In data-table.tsx:
    // <div className="rounded-md border overflow-x-auto">
    //   <Table style={enableColumnSizing ? { minWidth: table.getTotalSize() } : undefined}>

    // We can find the table by role "table" (which is default for <table>)
    // However, the Shadcn Table component renders a standard <table> but let's verify if role is preserved or we need data-slot.
    // Based on table.tsx, it passes props to <table>, so role="table" should be there implicitly or explicitly.
    // Let's use getByRole('table')

    const table = screen.getByRole("table");

    // Check if style contains minWidth
    // Note: Use regex or check style property directly.
    // The value will be a number (pixel value from getTotalSize, likely 150 default min size per column * 1 column = 150 or similar)
    // We just want to ensure min-width is set, and width is NOT set (or at least min-width is present).

    expect(table.style.minWidth).toBeTruthy();
    expect(table.style.width).toBe("");
  });

  it("does not apply min-width when enableColumnSizing is false", () => {
    render(<DataTable columns={columns} data={data} enableColumnSizing={false} />);
    const table = screen.getByRole("table");
    expect(table.style.minWidth).toBe("");
  });
});
