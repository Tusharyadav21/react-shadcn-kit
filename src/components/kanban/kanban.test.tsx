import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Kanban, type KanbanItem, type KanbanColumnDef } from "./kanban";

// Mock ResizeObserver for @dnd-kit
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

interface Task extends KanbanItem {
  title: string;
  description?: string;
}

const mockColumns: KanbanColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const mockTasks: Task[] = [
  {
    id: "1",
    status: "todo",
    title: "Task 1",
    description: "Description for task 1",
  },
  {
    id: "2",
    status: "todo",
    title: "Task 2",
  },
  {
    id: "3",
    status: "in-progress",
    title: "Task 3",
    description: "Description for task 3",
  },
  {
    id: "4",
    status: "done",
    title: "Task 4",
  },
];

describe("Kanban", () => {
  it("renders all columns", () => {
    const mockOnItemUpdate = vi.fn();
    render(<Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders tasks in correct columns", () => {
    const mockOnItemUpdate = vi.fn();
    render(<Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
    expect(screen.getByText("Task 4")).toBeInTheDocument();
  });

  it("displays task descriptions when available", () => {
    const mockOnItemUpdate = vi.fn();
    render(<Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />);

    expect(screen.getByText("Description for task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for task 3")).toBeInTheDocument();
  });

  it("shows correct task count in column badges", () => {
    const mockOnItemUpdate = vi.fn();
    render(<Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />);

    // There should be badges showing the count
    const badges = screen.getAllByText("2");
    expect(badges.length).toBeGreaterThan(0); // "To Do" column has 2 tasks
  });

  it("calls onItemClick when a card is clicked", () => {
    const mockOnItemUpdate = vi.fn();
    const mockOnItemClick = vi.fn();

    render(
      <Kanban
        items={mockTasks}
        columns={mockColumns}
        onItemUpdate={mockOnItemUpdate}
        onItemClick={mockOnItemClick}
      />,
    );

    const task1 = screen.getByText("Task 1");
    fireEvent.click(task1);

    expect(mockOnItemClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        title: "Task 1",
      }),
    );
  });

  it("renders with custom renderCard function", () => {
    const mockOnItemUpdate = vi.fn();
    const customRenderCard = (item: Task) => (
      <div data-testid={`custom-card-${item.id}`}>Custom: {item.title}</div>
    );

    render(
      <Kanban
        items={mockTasks}
        columns={mockColumns}
        onItemUpdate={mockOnItemUpdate}
        renderCard={customRenderCard}
      />,
    );

    expect(screen.getByTestId("custom-card-1")).toBeInTheDocument();
    expect(screen.getByText("Custom: Task 1")).toBeInTheDocument();
  });

  it("handles empty columns", () => {
    const mockOnItemUpdate = vi.fn();
    const emptyColumns: KanbanColumnDef[] = [
      { id: "empty1", title: "Empty Column 1" },
      { id: "empty2", title: "Empty Column 2" },
    ];

    render(<Kanban items={[]} columns={emptyColumns} onItemUpdate={mockOnItemUpdate} />);

    expect(screen.getByText("Empty Column 1")).toBeInTheDocument();
    expect(screen.getByText("Empty Column 2")).toBeInTheDocument();
  });

  it("renders fallback text for items without title or name", () => {
    const mockOnItemUpdate = vi.fn();
    const itemsWithoutTitle: KanbanItem[] = [
      {
        id: "no-title",
        status: "todo",
      },
    ];

    render(
      <Kanban items={itemsWithoutTitle} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />,
    );

    expect(screen.getByText("Item no-title")).toBeInTheDocument();
  });
});

describe("Kanban - Drag and Drop", () => {
  it("renders kanban board with data-slot attribute", () => {
    const mockOnItemUpdate = vi.fn();
    const { container } = render(
      <Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />,
    );

    const kanbanElement = container.querySelector('[data-slot="kanban"]');
    expect(kanbanElement).toBeInTheDocument();
  });

  it("renders kanban columns with data-slot attribute", () => {
    const mockOnItemUpdate = vi.fn();
    const { container } = render(
      <Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />,
    );

    const columnElements = container.querySelectorAll('[data-slot="kanban-column"]');
    expect(columnElements.length).toBe(3);
  });

  it("renders kanban cards with data-slot attribute", () => {
    const mockOnItemUpdate = vi.fn();
    const { container } = render(
      <Kanban items={mockTasks} columns={mockColumns} onItemUpdate={mockOnItemUpdate} />,
    );

    const cardElements = container.querySelectorAll('[data-slot="kanban-card"]');
    expect(cardElements.length).toBe(4);
  });
});
