# React Shadcn Kit Premium

A state-of-the-art, high-performance UI library built with **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. This kit provides a structured, type-safe foundation for building premium web applications and marketing sites with ease.

## ✨ Key Features

- **🚀 Premium Aesthetics**: Modern design system with vibrant colors, glassmorphism, and smooth animations.
- **🏗️ Atomic Architecture**: Organized into `primitives`, `composites`, and `marketing` layers for maximum reusability.
- **⚡ Performance First**: Zero Tailwind runtime overhead, optimized build pipeline, and light-weight exports.
- **🛡️ Type Safety**: Full TypeScript support with strict mode and exported types for every component.
- **🌟 Interactive Elements**: Advanced components like `ActionButton` with built-in transitions and `CustomButton` with rich hover effects.
- **📊 Data Components**: Production-ready `Kanban` board with drag-and-drop and `DataTable` with sorting, filtering, and pagination.
- **📣 Accessibility**: Built-in ARIA hooks and screen-reader utilities.

## 📦 Installation

```bash
npm install react-shadcn-kit
```

## 📂 Library Structure

We follow a modular structure to keep your bundle small:

- `react-shadcn-kit/primitives`: Core UI building blocks (Button, Input, LoadingSwap, etc.)
- `react-shadcn-kit/composites`: Complex interactive units (ActionButton, SidebarWrapper, UserMenu)
- `react-shadcn-kit/marketing`: high-impact landing page sections (HeroSection, SocialProof, ValueProps)
- `react-shadcn-kit/hooks`: Useful React hooks (useIsMobile, useAriaLive, useFocusVisible)
- `react-shadcn-kit/lib`: Essential utilities (cn, date formatting, slug generation)

## 🚀 Usage

### 🎨 Marketing Hero Section

```tsx
import { HeroSection } from "react-shadcn-kit/marketing";

export default function Landing() {
  return (
    <HeroSection
      title="Create something stunning"
      subtitle="Better design, faster development, premium results."
      ctaText="Get Started"
      badge="v0.1.1 is now live!"
    />
  );
}
```

### 🔘 Interactive Action Button

Handles async states, loading indicators, and confirmation dialogs automatically.

```tsx
import { ActionButton } from "react-shadcn-kit/composites";

async function deleteProject() {
  // Your async logic
  return { error: false, message: "Project deleted successfully" };
}

<ActionButton
  variant="destructive"
  action={deleteProject}
  requireAreYouSure
  areYouSureDescription="This will permanently delete your project data."
>
  Delete Project
</ActionButton>;
```

### 🛠️ Enhanced Utilities

```tsx
import { formatDate, generateSlug } from "react-shadcn-kit/lib";

const date = formatDate(new Date()); // "Oct 24, 2023"
const slug = generateSlug("Hello World!"); // "hello-world"
```

### 📋 Kanban Board

Build interactive task boards with drag-and-drop functionality.

```tsx
import { Kanban, type KanbanItem, type KanbanColumnDef } from "react-shadcn-kit/composites";

interface Task extends KanbanItem {
  title: string;
  description?: string;
}

const columns: KanbanColumnDef[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const tasks: Task[] = [
  { id: "1", status: "todo", title: "Design homepage", description: "Create mockups" },
  { id: "2", status: "in-progress", title: "Build API", description: "REST endpoints" },
];

<Kanban
  items={tasks}
  columns={columns}
  onItemUpdate={(itemId, newStatus) => {
    // Handle status update
    console.log(`Task ${itemId} moved to ${newStatus}`);
  }}
  onItemClick={(item) => {
    // Handle card click
    console.log("Clicked:", item);
  }}
/>;
```

### 📊 Data Table

Advanced data tables with sorting, filtering, and pagination.

```tsx
import { DataTable, DataTableColumnHeader } from "react-shadcn-kit/composites";
import { ColumnDef } from "@tanstack/react-table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
];

const data: Payment[] = [{ id: "1", amount: 100, status: "success", email: "user@example.com" }];

<DataTable
  columns={columns}
  data={data}
  searchKey="email"
  facetedFilters={[
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Success", value: "success" },
        { label: "Pending", value: "pending" },
      ],
    },
  ]}
/>;
```

## 🛠️ Development

Run the playground locally:

```bash
npm run dev
```

Validate exports and build:

```bash
npm run test:exports
npm run build
```

## 📄 License

MIT © [Tushar Yadav](https://github.com/tusharyadav21)
