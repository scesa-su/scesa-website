import type { SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/dates";

type PostMetaProps = Pick<SpotlightPost, "author" | "date" | "readingMinutes"> & { className?: string };

export function PostMeta({ author, date, readingMinutes, className }: PostMetaProps) {
  return (
    <p className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300", className)}>
      <span>By {author}</span>
      <span>
        <time dateTime={date}>{formatShortDate(date)}</time>, {readingMinutes} min read
      </span>
    </p>
  );
}
