export type KanbanId = string | number;

export interface KanbanColumnDef {
  id: string;
  title: string;
}

export interface KanbanItem {
  id: KanbanId;
  status: string;
  [key: string]: unknown;
}

export interface KanbanBoardProps<T extends KanbanItem> {
  items: T[];
  columns?: KanbanColumnDef[];
  onItemUpdate: (itemId: KanbanId, newStatus: string) => void;
  onItemClick?: (item: T) => void;
  renderCard?: (item: T) => React.ReactNode;
}
