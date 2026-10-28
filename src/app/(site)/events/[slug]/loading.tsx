import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function EventLoading() {
  return (
    <LoadingPage className="mx-auto w-full max-w-360 px-4 py-8 md:px-8 lg:px-14 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-3/4 lg:h-12" />
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-8 w-56" />
          {["w-full", "w-11/12", "w-full", "w-2/3"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}
