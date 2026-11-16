import { PAGE } from "@/lib/styles";
import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <LoadingPage className={PAGE}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-6 h-14 w-64 lg:h-20 lg:w-96" />
      <Skeleton className="mt-6 h-6 w-full max-w-xl" />
      <div className="mt-12 flex flex-wrap gap-2 border-t border-brand-border pt-8">
        <Skeleton className="h-12 w-full rounded-full md:w-120" />
        <Skeleton className="h-12 w-full rounded-full md:ml-auto md:w-80" />
      </div>
      <Skeleton className="mt-6 h-4 w-16" />
      <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-brand-border">
            <Skeleton className="aspect-16/10 rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-4 h-9 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </LoadingPage>
  );
}
