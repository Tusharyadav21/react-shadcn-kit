"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "../primitives/separator";
import { buttonGroupVariants } from "./button-group-variants";

interface ButtonGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="button-group"
        data-orientation={orientation || "horizontal"}
        className={cn(buttonGroupVariants({ orientation }), className)}
        {...props}
      />
    );
  },
);

interface ButtonGroupTextProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    );
  },
);

const ButtonGroupSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative m-0! self-stretch data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  );
});

ButtonGroup.displayName = "ButtonGroup";
ButtonGroupText.displayName = "ButtonGroupText";
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
export type { ButtonGroupProps, ButtonGroupTextProps };
