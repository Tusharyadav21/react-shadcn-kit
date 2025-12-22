import { format, formatDistanceToNow } from "date-fns";

/**
 * Format a date into a human-readable string.
 * @example "Oct 24, 2023"
 */
export function formatDate(date: Date | string | number) {
  return format(new Date(date), "MMM d, yyyy");
}

/**
 * Format a date into a long human-readable string with time.
 * @example "October 24, 2023 at 10:00 AM"
 */
export function formatDateTime(date: Date | string | number) {
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
}

/**
 * Format a date relative to now.
 * @example "2 days ago"
 */
export function formatRelative(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Map database errors to user-friendly messages.
 * Generic template for common DB constraints.
 */
export function mapDatabaseError(error: unknown): { error: true; message: string } {
  const err = error as { code?: string; message?: string };
  const code = err?.code || err?.message;

  if (code === "P2002" || code?.includes("unique_violation")) {
    return { error: true, message: "This record already exists." };
  }

  if (code === "P2003" || code?.includes("foreign_key_violation")) {
    return {
      error: true,
      message: "This operation could not be completed because of a related record.",
    };
  }

  return { error: true, message: "An unexpected database error occurred." };
}
