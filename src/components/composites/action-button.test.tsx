import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActionButton } from "./action-button";
import { describe, it, expect, vi } from "vitest";
import { toast } from "sonner";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ActionButton", () => {
  it("executes action on click", async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: false, message: "Success" });
    render(<ActionButton action={mockAction}>Confirm</ActionButton>);

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(mockAction).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("Success");
  });

  it("handles action failure", async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: true, message: "Failed" });
    render(<ActionButton action={mockAction}>Failed Action</ActionButton>);

    fireEvent.click(screen.getByRole("button", { name: /failed action/i }));

    await waitFor(() => expect(mockAction).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });

  it("shows confirmation dialog when required", async () => {
    const mockAction = vi.fn().mockResolvedValue({ error: false });
    render(
      <ActionButton action={mockAction} requireAreYouSure areYouSureTitle="Confirm Title">
        Delete
      </ActionButton>,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Check if dialog is visible
    expect(screen.getByText("Confirm Title")).toBeInTheDocument();

    // Click confirm in dialog
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(mockAction).toHaveBeenCalled());
  });
});
