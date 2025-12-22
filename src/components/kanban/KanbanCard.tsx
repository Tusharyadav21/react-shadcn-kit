"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";
import type { KanbanItem } from "./kanban-types";

interface Props<T extends KanbanItem> {
  card: T;
  onCardClick?: (item: T) => void;
  renderCard?: (item: T) => React.ReactNode;
}

function KanbanCardInner<T extends KanbanItem>({ card, onCardClick, renderCard }: Props<T>) {
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
        className="opacity-30 bg-background p-3 rounded-xl border border-primary/50 cursor-grab relative h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) {
          onCardClick?.(card);
        }
      }}
      className="bg-background p-3 rounded-xl hover:ring-2 hover:ring-primary/20 hover:ring-inset cursor-grab relative border border-border/50 shadow-sm space-y-2 group transition-all"
    >
      {renderCard ? (
        renderCard(card)
      ) : (
        <div className="space-y-1">
          <div className="font-medium text-sm line-clamp-1">
            {(card.title as string) || (card.name as string) || `Item ${card.id}`}
          </div>
          {typeof card.description === "string" && (
            <div className="text-xs text-muted-foreground line-clamp-2">{card.description}</div>
          )}
        </div>
      )}
    </div>
  );
}

export const KanbanCard = memo(KanbanCardInner) as typeof KanbanCardInner;
