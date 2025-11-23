"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";
import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { cn } from "@/lib/utils";

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  items?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

export function UserMenu({ user, items, className }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("rounded-full", className)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items?.map((item, i) => (
          <DropdownMenuItem key={i} asChild>
            <a href={item.href ?? "#"} onClick={item.onClick}>
              {item.icon && React.createElement(item.icon, { className: "mr-2 h-4 w-4" })}
              <span>{item.label}</span>
            </a>
          </DropdownMenuItem>
        ))}
        {!items?.length && (
          <DropdownMenuItem asChild>
            <a href="#profile">Profile</a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
