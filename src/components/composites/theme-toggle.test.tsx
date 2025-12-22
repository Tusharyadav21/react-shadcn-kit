import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../primitives/theme-provider";

describe("ThemeToggle", () => {
  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    // It's a button with icons
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
