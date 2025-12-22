import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComponentSearch, { type SearchResult } from "./ComponentSearch";

describe("ComponentSearch", () => {
  it("renders with default placeholder", () => {
    render(<ComponentSearch />);
    expect(screen.getByPlaceholderText("Search components...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<ComponentSearch placeholder="Search anything..." />);
    expect(screen.getByPlaceholderText("Search anything...")).toBeInTheDocument();
  });

  it("shows clear button when query is entered", () => {
    render(<ComponentSearch />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clears query when clear button is clicked", () => {
    render(<ComponentSearch />);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);
    expect(input.value).toBe("");
  });

  it("calls onSearch after debounce delay", async () => {
    const mockSearch = vi.fn().mockResolvedValue([]);
    render(<ComponentSearch onSearch={mockSearch} debounceMs={100} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "test query" } });

    await waitFor(
      () => {
        expect(mockSearch).toHaveBeenCalledWith("test query");
      },
      { timeout: 200 },
    );
  });

  it("displays search results", async () => {
    const mockResults: SearchResult[] = [
      { id: "1", title: "Button", description: "A clickable button", category: "Components" },
      { id: "2", title: "Input", description: "Text input field", category: "Components" },
    ];
    const mockSearch = vi.fn().mockResolvedValue(mockResults);
    render(<ComponentSearch onSearch={mockSearch} debounceMs={50} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "bu" } });

    await waitFor(() => {
      expect(screen.getByText("Button")).toBeInTheDocument();
      expect(screen.getByText("Input")).toBeInTheDocument();
    });
  });

  it("calls onSelect when result is clicked", async () => {
    const mockResults: SearchResult[] = [{ id: "1", title: "Button", category: "Components" }];
    const mockSearch = vi.fn().mockResolvedValue(mockResults);
    const mockSelect = vi.fn();
    render(<ComponentSearch onSearch={mockSearch} onSelect={mockSelect} debounceMs={50} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "bu" } });

    await waitFor(() => {
      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Button"));
    expect(mockSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it("shows 'no results' message when search returns empty", async () => {
    const mockSearch = vi.fn().mockResolvedValue([]);
    render(<ComponentSearch onSearch={mockSearch} debounceMs={50} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "xyz" } });

    await waitFor(() => {
      expect(screen.getByText(/No results found for "xyz"/)).toBeInTheDocument();
    });
  });
});
