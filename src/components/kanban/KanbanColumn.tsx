"use client"

import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, memo } from "react"
import type { KanbanColumnDef, KanbanItem } from "./kanban-types"
import { KanbanCard } from "./KanbanCard"

interface Props<T extends KanbanItem> {
  column: KanbanColumnDef
  items: T[]
  onCardClick?: (item: T) => void
  renderCard?: (item: T) => React.ReactNode
}

function KanbanColumnInner<T extends KanbanItem>({
  column,
  items,
  onCardClick,
  renderCard,
}: Props<T>) {
  const itemIds = useMemo(() => {
    return items.map((item) => item.id)
  }, [items])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: true, // Disable column reordering by default
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-muted/30 opacity-40 border-2 border-primary/30 w-[300px] min-w-[300px] h-[600px] max-h-[600px] rounded-md flex flex-col"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-muted/10 w-[300px] min-w-[300px] h-[600px] max-h-[600px] rounded-xl flex flex-col border"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className="bg-background/50 backdrop-blur-sm text-md h-[60px] rounded-t-xl p-4 font-semibold border-b border-border/50 flex items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium rounded-full">
            {items.length}
          </div>
          {column.title}
        </div>
      </div>

      {/* Column items container */}
      <div className="flex grow flex-col gap-3 p-3 overflow-x-hidden overflow-y-auto custom-scrollbar">
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
      </div>
    </div>
  )
}

export const KanbanColumn = memo(KanbanColumnInner) as typeof KanbanColumnInner
