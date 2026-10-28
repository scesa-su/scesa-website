import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <LoadingPage className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-9 lg:pb-20">
      <Skeleton className="h-10 w-40 lg:h-12" />
      <Skeleton className="mt-3 h-5 w-full max-w-lg" />
      <div className="mt-8 flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
        <Skeleton className="h-10 w-full sm:ml-auto sm:w-64" />
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
