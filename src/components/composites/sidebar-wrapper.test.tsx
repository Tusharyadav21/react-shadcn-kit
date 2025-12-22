import { render, screen } from "@testing-library/react";
import { SidebarWrapper } from "./sidebar-wrapper";
import { describe, it, expect } from "vitest";

describe("SidebarWrapper", () => {
  it("renders children in content area", () => {
    render(
      <SidebarWrapper>
        <div data-testid="sidebar-child">Hello Sidebar</div>
      </SidebarWrapper>,
    );
    expect(screen.getByTestId("sidebar-child")).toBeInTheDocument();
  });

  it("renders custom trigger", () => {
    render(
      <SidebarWrapper trigger={<button data-testid="custom-trigger">Open</button>}>
        <div>Content</div>
      </SidebarWrapper>,
    );
    expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
  });
});
