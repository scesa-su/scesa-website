import { FOCUS_RING } from "@/lib/styles";
import { Footer } from "@/presentation/components/layout/Footer";
import { Navbar } from "@/presentation/components/layout/Navbar";
import { MotionProvider } from "@/presentation/context/MotionProvider";

export default function SiteLayout({ children }: Pick<LayoutProps<"/">, "children">) {
  return (
    <MotionProvider>
      <a
        href="#content"
        className={`sr-only z-50 rounded-lg bg-brand-surface px-4 py-2 text-brand-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 ${FOCUS_RING}`}
      >
        Skip to content
      </a>
      <Navbar />
      <div id="content" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
        {children}
      </div>
      <Footer />
    </MotionProvider>
  );
}
