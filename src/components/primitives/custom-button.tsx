"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";
import { customButtonVariants } from "./custom-button-variants";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: React.ElementType;
  loadingIconPlacement?: "left" | "right";
  icon?: React.ElementType;
  iconPlacement?: "left" | "right";
}

/**
 * CustomButton
 *
 * An enhanced button component with premium animations, loading states,
 * and accessibility baked in. Supports icons with flexible placement
 * and various visual effects like expansion and ring hovers.
 */
const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant,
      effect,
      size,
      asChild = false,
      loading,
      loadingText,
      loadingIcon: LoadingIcon = Spinner,
      loadingIconPlacement = "left",
      icon: Icon,
      iconPlacement = "left",
      children,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = loading || disabled;

    // Accessibility: Automatic label if children is empty (icon-only button)
    const effectiveAriaLabel =
      ariaLabel || (typeof children === "string" ? undefined : loading ? loadingText : undefined);

    const renderIcon = (placement: "left" | "right") => {
      const ActiveIcon = loading ? LoadingIcon : Icon;
      if (!ActiveIcon) return null;

      // Logic to determine if this icon should be displayed based on placement
      if (loading && loadingIconPlacement !== placement) return null;
      if (!loading && iconPlacement !== placement) return null;

      const iconContent = (
        <ActiveIcon aria-hidden="true" className={cn(loading && !loadingText && "animate-spin")} />
      );

      if (effect === "expandIcon") {
        return (
          <span
            className={cn(
              "transition-all duration-200 opacity-0 w-0 overflow-hidden inline-flex items-center justify-center",
              placement === "left"
                ? "group-hover:opacity-100 group-hover:w-5 group-hover:pr-1"
                : "group-hover:opacity-100 group-hover:w-5 group-hover:pl-1",
            )}
          >
            {iconContent}
          </span>
        );
      }

      return iconContent;
    };

    return (
      <Comp
        ref={ref}
        className={cn(customButtonVariants({ variant, effect, size, className }))}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={effectiveAriaLabel}
        {...props}
      >
        {renderIcon("left")}
        <Slottable>
          {loading && loadingText ? (
            <span className="inline-flex items-center gap-2">{loadingText}</span>
          ) : (
            children
          )}
        </Slottable>
        {renderIcon("right")}

        {/* Screen Reader Announcements */}
        {loading && (
          <span className="sr-only" aria-live="polite">
            {loadingText || "Loading..."}
          </span>
        )}
      </Comp>
    );
  },
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
export type { CustomButtonProps };
