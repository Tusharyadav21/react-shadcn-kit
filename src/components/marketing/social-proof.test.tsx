import { render, screen } from "@testing-library/react";
import { SocialProof } from "./social-proof";
import { describe, it, expect } from "vitest";

describe("SocialProof", () => {
  it("renders logos with names", () => {
    const logos = [
      { name: "Acme Corp", src: "/acme.png" },
      { name: "Global Inc", src: "/global.png" },
    ];
    render(<SocialProof logos={logos} title="Custom Title" />);

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Global Inc")).toBeInTheDocument();
  });
});
