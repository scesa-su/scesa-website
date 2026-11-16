import { CONTAINER } from "@/lib/styles";
import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function EventLoading() {
  return (
    <LoadingPage className={`${CONTAINER} pt-8 pb-16 lg:pt-12`}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-10 h-3 w-40" />
      <Skeleton className="mt-6 h-14 w-full max-w-2xl lg:h-20" />
      <Skeleton className="mt-6 h-6 w-full max-w-xl" />
      <div className="mt-12 grid gap-6 border-t border-brand-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Skeleton className="aspect-4/5 rounded-3xl lg:col-span-5" />
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Skeleton className="h-8 w-56" />
          {["w-full", "w-11/12", "w-full", "w-2/3", "w-full", "w-3/4"].map((w, i) => (
            <Skeleton key={i} className={`h-5 ${w}`} />
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}
