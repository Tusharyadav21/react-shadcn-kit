"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleVariants } from "./toggle-variants";

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <TogglePrimitive.Root
        ref={ref}
        data-slot="toggle"
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
export type { ToggleProps };
