"use client";

import * as React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingSwapProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  loadingNode?: React.ReactNode;
}

const LoadingSwap = React.forwardRef<HTMLDivElement, LoadingSwapProps>(
  ({ isLoading, loadingNode, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        data-testid="loading-swap-container"
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            {loadingNode || <Spinner />}
          </div>
        )}
        <div className={cn("transition-opacity", isLoading ? "opacity-0" : "opacity-100")}>
          {children}
        </div>
      </div>
    );
  },
);

LoadingSwap.displayName = "LoadingSwap";

export { LoadingSwap };
export type { LoadingSwapProps };
