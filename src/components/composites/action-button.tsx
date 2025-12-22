"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../primitives/alert-dialog";
import { CustomButton, type CustomButtonProps } from "../primitives/custom-button";

interface ActionButtonProps extends CustomButtonProps {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireAreYouSure?: boolean;
  areYouSureTitle?: React.ReactNode;
  areYouSureDescription?: React.ReactNode;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      action,
      requireAreYouSure = false,
      areYouSureTitle = "Are you sure?",
      areYouSureDescription = "This action cannot be undone.",
      showSuccessToast = true,
      showErrorToast = true,
      children,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isPending, startTransition] = useTransition();

    const performAction = () => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result.error) {
            if (showErrorToast) {
              toast.error(result.message || "An error occurred");
            }
          } else {
            if (showSuccessToast && result.message) {
              toast.success(result.message);
            }
          }
        } catch (error) {
          if (showErrorToast) {
            toast.error("A critical error occurred");
          }
          console.error("ActionButton error:", error);
        }
      });
    };

    const triggerButton = (
      <CustomButton
        {...props}
        ref={ref}
        disabled={disabled || isPending}
        loading={!requireAreYouSure && isPending}
        onClick={(e) => {
          if (!requireAreYouSure) {
            performAction();
          }
          onClick?.(e);
        }}
      >
        {children}
      </CustomButton>
    );

    if (requireAreYouSure) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{areYouSureTitle}</AlertDialogTitle>
              <AlertDialogDescription>{areYouSureDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <CustomButton
                  variant="destructive"
                  loading={isPending}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent closing immediately if we want to show loading
                    performAction();
                  }}
                >
                  Confirm
                </CustomButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return triggerButton;
  },
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
export type { ActionButtonProps };
