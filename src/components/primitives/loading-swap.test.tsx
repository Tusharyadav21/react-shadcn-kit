import { render, screen } from "@testing-library/react";
import { LoadingSwap } from "./loading-swap";
import { describe, it, expect } from "vitest";

describe("LoadingSwap", () => {
  it("renders children when not loading", () => {
    render(
      <LoadingSwap isLoading={false}>
        <div data-testid="content">Loaded Content</div>
      </LoadingSwap>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders loading indicator when loading", () => {
    render(
      <LoadingSwap isLoading={true}>
        <div data-testid="content">Loaded Content</div>
      </LoadingSwap>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
    // It should be invisible though
    expect(screen.getByTestId("content").parentElement).toHaveClass("opacity-0");
    // Default spinner has aria-label or status role? Let's check spinner.tsx
    // Spinner uses Loader2 which doesn't have role by default, but LoadingSwap wraps it in a div with no specific role.
    // However, it should be in the DOM.
    const container = screen.getByTestId("loading-swap-container");
    expect(container).toBeInTheDocument();
  });

  it("renders custom loading node", () => {
    render(
      <LoadingSwap
        isLoading={true}
        loadingNode={<span data-testid="custom-loader">Loading...</span>}
      >
        <div>Content</div>
      </LoadingSwap>,
    );
    expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
  });
});
