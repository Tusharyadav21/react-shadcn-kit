"use client";

import { useMemo, useState, useEffect } from "react";
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
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { KanbanBoardProps, KanbanItem, KanbanId } from "./kanban-types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

export function KanbanBoard<T extends KanbanItem>({
  items,
  columns = [],
  onItemUpdate,
  onItemClick,
  renderCard,
}: KanbanBoardProps<T>) {
  const [activeDragId, setActiveDragId] = useState<KanbanId | null>(null);
  const [activeDragType, setActiveDragType] = useState<"Column" | "Card" | null>(null);

  // Local state for optimistic updates during drag
  const [localItems, setLocalItems] = useState<T[]>(items);

  // Sync local items when props change (if not dragging)
  useEffect(() => {
    if (!activeDragId) {
      setLocalItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items), activeDragId]);

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

  const activeItem = useMemo(() => {
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

  const itemsByStatus = useMemo(() => {
    const grouped: Record<string, T[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = [];
    });
    localItems.forEach((item) => {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      } else if (columns.length > 0) {
        // Fallback to first column if status is unknown and columns exist
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
    <div className="flex h-full w-full items-start overflow-x-auto overflow-y-hidden py-4">
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
