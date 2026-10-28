import { CONTAINER } from "@/presentation/components/about/styles";
import { LoadingPage, Skeleton } from "@/presentation/components/ui/Skeleton";

export default function SpotlightArticleLoading() {
  return (
    <LoadingPage className={`${CONTAINER} py-12 lg:pb-24`}>
      <div className="mx-auto max-w-[68ch]">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-4 h-10 w-full lg:h-14" />
        <Skeleton className="mt-2 h-10 w-2/3 lg:h-14" />
        <Skeleton className="mt-4 h-6 w-full" />
        <Skeleton className="mt-4 h-4 w-48" />
        <Skeleton className="mt-10 aspect-video rounded-2xl" />
        <div className="mt-10 flex flex-col gap-3">
          {["w-full", "w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"].map((w, i) => (
            <Skeleton key={i} className={`h-5 ${w}`} />
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}
