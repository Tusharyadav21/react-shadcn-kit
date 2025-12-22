import * as React from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type KanbanId = string | number;

export interface KanbanColumnDef {
  id: string;
  title: string;
}

export interface KanbanItem {
  id: KanbanId;
  status: string;
  title?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

// ============================================================================
// Kanban Root
// ============================================================================

interface KanbanRootProps<T extends KanbanItem> {
  items: T[];
  columns?: KanbanColumnDef[];
  onItemUpdate: (itemId: KanbanId, newStatus: string) => void;
  onItemClick?: (item: T) => void;
  renderCard?: (item: T) => React.ReactNode;
  className?: string;
}

function KanbanRoot<T extends KanbanItem>({
  items,
  columns = [],
  onItemUpdate,
  onItemClick,
  renderCard,
  className,
}: KanbanRootProps<T>) {
  const [activeDragId, setActiveDragId] = React.useState<KanbanId | null>(null);
  const [activeDragType, setActiveDragType] = React.useState<"Column" | "Card" | null>(null);
  const [localItems, setLocalItems] = React.useState<T[]>(items);

  // Sync local items when props change (if not dragging)
  React.useEffect(() => {
    if (!activeDragId) {
      setLocalItems(items);
    }
  }, [items, activeDragId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeItem = React.useMemo(() => {
    if (activeDragType === "Card" && activeDragId) {
      return localItems.find((l) => l.id === activeDragId);
    }
    return null;
  }, [activeDragId, activeDragType, localItems]);

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Card") {
      setActiveDragId(event.active.id as KanbanId);
      setActiveDragType("Card");
      setLocalItems(items);
      return;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveACard) return;

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      const activeIndex = localItems.findIndex((t) => t.id === activeId);
      const overIndex = localItems.findIndex((t) => t.id === overId);

      if (localItems[activeIndex].status !== localItems[overIndex].status) {
        const newItems = [...localItems];
        newItems[activeIndex] = {
          ...newItems[activeIndex],
          status: localItems[overIndex].status,
        };
        const reorderedItems = arrayMove(newItems, activeIndex, overIndex);
        setLocalItems(reorderedItems);
      } else {
        const reorderedItems = arrayMove(localItems, activeIndex, overIndex);
        setLocalItems(reorderedItems);
      }
    }

    // Dropping a Card over a Column
    if (isActiveACard && isOverAColumn) {
      const activeIndex = localItems.findIndex((t) => t.id === activeId);
      const newItems = [...localItems];
      newItems[activeIndex] = {
        ...newItems[activeIndex],
        status: overId as string,
      };
      setLocalItems(newItems);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeItemId = active.id as KanbanId;

    // Reset drag state
    setActiveDragId(null);
    setActiveDragType(null);

    if (!over) return;

    const currentItem = localItems.find((l) => l.id === activeItemId);
    if (currentItem) {
      onItemUpdate(activeItemId, currentItem.status);
    }
  }

  const itemsByStatus = React.useMemo(() => {
    const grouped: Record<string, T[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = [];
    });
    localItems.forEach((item) => {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      } else if (columns.length > 0) {
        grouped[columns[0].id].push(item);
      }
    });
    return grouped;
  }, [localItems, columns]);

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <div
      data-slot="kanban"
      className={cn(
        "flex h-full w-full items-start overflow-x-auto overflow-y-hidden py-4",
        className,
      )}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-4">
          {columns.map((col) => (
            <KanbanColumn<T>
              key={col.id}
              column={col}
              items={itemsByStatus[col.id] || []}
              onCardClick={onItemClick}
              renderCard={renderCard}
            />
          ))}
        </div>

        {typeof document !== "undefined" &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeItem && <KanbanCard<T> card={activeItem} renderCard={renderCard} />}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );
}

// ============================================================================
// Kanban Column
// ============================================================================

interface KanbanColumnProps<T extends KanbanItem> {
  column: KanbanColumnDef;
  items: T[];
  onCardClick?: (item: T) => void;
  renderCard?: (item: T) => React.ReactNode;
  className?: string;
}

function KanbanColumn<T extends KanbanItem>({
  column,
  items,
  onCardClick,
  renderCard,
  className,
}: KanbanColumnProps<T>) {
  const itemIds = React.useMemo(() => {
    return items.map((item) => item.id);
  }, [items]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: true, // Disable column reordering by default
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        data-slot="kanban-column"
        className="bg-muted/30 opacity-40 border-2 border-primary/30 w-[300px] min-w-[300px] h-[600px] max-h-[600px] rounded-md flex flex-col"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="kanban-column"
      className={cn(
        "bg-muted/10 w-[300px] min-w-[300px] h-[600px] max-h-[600px] rounded-xl flex flex-col border",
        className,
      )}
    >
      <KanbanColumnHeader {...attributes} {...listeners}>
        <KanbanColumnBadge>{items.length}</KanbanColumnBadge>
        {column.title}
      </KanbanColumnHeader>

      <KanbanColumnContent>
        <SortableContext items={itemIds}>
          {items.map((item) => (
            <KanbanCard<T>
              key={item.id}
              card={item}
              onCardClick={onCardClick}
              renderCard={renderCard}
            />
          ))}
        </SortableContext>
      </KanbanColumnContent>
    </div>
  );
}

// ============================================================================
// Kanban Column Header
// ============================================================================

function KanbanColumnHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-column-header"
      className={cn(
        "bg-background/50 backdrop-blur-sm text-md h-[60px] rounded-t-xl p-4 font-semibold border-b border-border/50 flex items-center justify-between",
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Kanban Column Badge
// ============================================================================

function KanbanColumnBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-column-badge"
      className={cn(
        "flex justify-center items-center bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium rounded-full",
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Kanban Column Content
// ============================================================================

function KanbanColumnContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-column-content"
      className={cn("flex grow flex-col gap-3 p-3 overflow-x-hidden overflow-y-auto", className)}
      {...props}
    />
  );
}

// ============================================================================
// Kanban Card
// ============================================================================

interface KanbanCardProps<T extends KanbanItem> {
  card: T;
  onCardClick?: (item: T) => void;
  renderCard?: (item: T) => React.ReactNode;
  className?: string;
}

const KanbanCardInner = <T extends KanbanItem>({
  card,
  onCardClick,
  renderCard,
  className,
}: KanbanCardProps<T>) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        data-slot="kanban-card"
        className="opacity-30 bg-background p-3 rounded-xl border border-primary/50 cursor-grab relative h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="kanban-card"
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) {
          onCardClick?.(card);
        }
      }}
      className={cn(
        "bg-background p-3 rounded-xl hover:ring-2 hover:ring-primary/20 hover:ring-inset cursor-grab relative border border-border/50 shadow-sm space-y-2 group transition-all",
        className,
      )}
    >
      {renderCard ? (
        renderCard(card)
      ) : (
        <div className="space-y-1">
          <KanbanCardTitle>{card.title || card.name || `Item ${card.id}`}</KanbanCardTitle>
          {card.description && <KanbanCardDescription>{card.description}</KanbanCardDescription>}
        </div>
      )}
    </div>
  );
};

const KanbanCard = React.memo(KanbanCardInner) as typeof KanbanCardInner;

// ============================================================================
// Kanban Card Title
// ============================================================================

function KanbanCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-card-title"
      className={cn("font-medium text-sm line-clamp-1", className)}
      {...props}
    />
  );
}

// ============================================================================
// Kanban Card Description
// ============================================================================

function KanbanCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-card-description"
      className={cn("text-xs text-muted-foreground line-clamp-2", className)}
      {...props}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  KanbanRoot as Kanban,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanColumnBadge,
  KanbanColumnContent,
  KanbanCard,
  KanbanCardTitle,
  KanbanCardDescription,
};
