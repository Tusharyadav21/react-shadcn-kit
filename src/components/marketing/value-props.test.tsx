import { render, screen } from "@testing-library/react";
import { ValueProps } from "./value-props";
import { describe, it, expect } from "vitest";
import { ZapIcon } from "lucide-react";

describe("ValueProps", () => {
  it("renders features appropriately", () => {
    const features = [
      { name: "Fast", description: "Blazing fast speeds", icon: ZapIcon },
      { name: "Secure", description: "Bank-grade security" },
    ];
    render(<ValueProps features={features} title="Powerful Features" badge="Benefits" />);

    expect(screen.getByText("Powerful Features")).toBeInTheDocument();
    expect(screen.getByText("Benefits")).toBeInTheDocument();
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Blazing fast speeds")).toBeInTheDocument();
    expect(screen.getByText("Secure")).toBeInTheDocument();
  });
});
