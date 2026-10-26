import { Footer } from "@/presentation/components/layout/Footer";
import { Navbar } from "@/presentation/components/layout/Navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-brand-surface px-4 py-2 text-brand-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        Skip to content
      </a>
      <Navbar />
      <div id="content" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
        {children}
      </div>
      <Footer />
    </>
  );
}
