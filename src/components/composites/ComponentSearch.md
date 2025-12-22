# ComponentSearch

An enhanced, interactive search component with debouncing, dropdown results, and smooth animations.

## Features

- 🔍 **Debounced Search** - Configurable debounce delay to reduce API calls
- 🎨 **Animated Dropdown** - Smooth animations powered by Framer Motion
- 📱 **Responsive** - Hidden on mobile by default, configurable
- ⌨️ **Keyboard Support** - Enter to search, Escape to close
- 🎯 **Categorized Results** - Automatically groups results by category
- ♿ **Accessible** - ARIA attributes for screen readers
- 🎨 **Customizable** - Flexible props for styling and behavior

## Installation

This component is part of the `react-shadcn-kit` library. Make sure you have the required dependencies:

```bash
npm install framer-motion lucide-react
```

## Usage

### Basic Usage

```tsx
import { ComponentSearch } from "react-shadcn-kit";

function App() {
  return <ComponentSearch />;
}
```

### With Search Handler

```tsx
import { ComponentSearch, type SearchResult } from "react-shadcn-kit";

const mockComponents: SearchResult[] = [
  {
    id: "button",
    title: "Button",
    description: "Clickable button component",
    category: "Primitives",
  },
  {
    id: "input",
    title: "Input",
    description: "Text input field",
    category: "Primitives",
  },
];

function App() {
  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Filter results
    return mockComponents.filter(
      (component) =>
        component.title.toLowerCase().includes(query.toLowerCase()) ||
        component.description?.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const handleSelect = (result: SearchResult) => {
    console.log("Selected:", result);
    // Navigate to component page or perform action
  };

  return <ComponentSearch onSearch={handleSearch} onSelect={handleSelect} />;
}
```

### With Icons

```tsx
import { ComponentSearch, type SearchResult } from "react-shadcn-kit";
import { Button, Input, Card } from "lucide-react";

const components: SearchResult[] = [
  {
    id: "button",
    title: "Button",
    description: "Clickable button",
    category: "Primitives",
    icon: <Button className="h-4 w-4" />,
  },
  {
    id: "input",
    title: "Input",
    description: "Text input",
    category: "Primitives",
    icon: <Input className="h-4 w-4" />,
  },
];
```

## Props

| Prop             | Type                                         | Default                  | Description                                     |
| ---------------- | -------------------------------------------- | ------------------------ | ----------------------------------------------- |
| `placeholder`    | `string`                                     | `"Search components..."` | Placeholder text for the search input           |
| `onSearch`       | `(query: string) => Promise<SearchResult[]>` | `undefined`              | Async function to fetch search results          |
| `onSelect`       | `(result: SearchResult) => void`             | `undefined`              | Callback when a search result is selected       |
| `minQueryLength` | `number`                                     | `2`                      | Minimum characters required before search       |
| `debounceMs`     | `number`                                     | `300`                    | Debounce delay in milliseconds                  |
| `className`      | `string`                                     | `undefined`              | Custom className for the container              |
| `showOnMobile`   | `boolean`                                    | `false`                  | Whether to show the component on mobile devices |

## SearchResult Type

```typescript
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  category?: string;
}
```

## Examples

### Custom Styling

```tsx
<ComponentSearch className="max-w-lg" placeholder="Search documentation..." showOnMobile={true} />
```

### Fast Search (No Debounce)

```tsx
<ComponentSearch debounceMs={0} minQueryLength={1} onSearch={instantSearch} />
```

### With Custom Categories

```tsx
const results: SearchResult[] = [
  { id: "1", title: "Button", category: "Components" },
  { id: "2", title: "Installation", category: "Documentation" },
  { id: "3", title: "Theme", category: "Guides" },
];
```

## Keyboard Shortcuts

- **Enter** - Submit search (closes dropdown)
- **Escape** - Close dropdown
- **Click outside** - Close dropdown

## Accessibility

The component includes proper ARIA attributes:

- `role="combobox"` on the input
- `aria-autocomplete="list"`
- `aria-expanded` to indicate dropdown state
- `aria-controls` linking to results dropdown
- `aria-label` on clear button

## Styling

The component uses Tailwind CSS classes and respects your theme configuration. It automatically adapts to light/dark mode through CSS variables.

## Testing

The component includes comprehensive tests. Run them with:

```bash
npm test ComponentSearch.test.tsx
```

## License

MIT
