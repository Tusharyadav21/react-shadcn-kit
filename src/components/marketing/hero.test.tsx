import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero";
import { describe, it, expect } from "vitest";

describe("HeroSection", () => {
  it("renders title and subtitle", () => {
    render(<HeroSection title="Hero Title" subtitle="Hero Subtitle" />);
    expect(screen.getByText("Hero Title")).toBeInTheDocument();
    expect(screen.getByText("Hero Subtitle")).toBeInTheDocument();
  });

  it("renders CTAs", () => {
    render(<HeroSection title="Title" ctaText="Click Me" ctaHref="/go" />);
    const cta = screen.getByRole("link", { name: /click me/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/go");
  });

  it("renders badge when provided", () => {
    render(<HeroSection title="Title" badge="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
