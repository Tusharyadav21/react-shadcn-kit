"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../primitives/dialog";

interface KanbanItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function KanbanItemDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  sidebar,
  className,
}: KanbanItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[900px] max-h-[90vh] flex flex-col ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
          <div className="flex-1 overflow-y-auto pr-2">{children}</div>

          {sidebar && (
            <div className="w-full md:w-1/3 border-l pl-0 md:pl-6 flex flex-col h-full">
              {sidebar}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
