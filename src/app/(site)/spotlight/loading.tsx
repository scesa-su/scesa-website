import { CONTAINER } from "@/presentation/components/about/styles";
import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function SpotlightLoading() {
  return (
    <LoadingPage className={`${CONTAINER} py-12 lg:pb-24`}>
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-10 w-2/3 lg:h-14" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <div className="mt-8 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-12 grid grid-cols-[7rem_minmax(0,1fr)] gap-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-10">
          <Skeleton className="aspect-4/3 rounded-none" />
          <div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="mt-2 h-9 w-3/4" />
            <Skeleton className="mt-4 h-5 w-full" />
            <Skeleton className="mt-4 h-4 w-40" />
          </div>
        </div>
        <div className="mt-10 divide-y divide-brand-border border-t border-brand-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
              <Skeleton className="aspect-4/3 rounded-none" />
              <div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-4 h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}
