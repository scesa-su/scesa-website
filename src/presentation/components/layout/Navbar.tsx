import { Button } from "@/presentation/components/ui/Button";
import { Logo } from "./Logo";
import { MobileDrawer } from "./MobileDrawer";
import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-brand-surface dark:border-b dark:border-brand-border">
      <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between gap-6 px-4 md:px-8 lg:h-24 lg:px-14">
        <Logo />
        <div className="flex items-center lg:gap-12 xl:gap-16">
          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks />
          </nav>
          <Button href="/join" size="lg" className="hidden focus-visible:ring-offset-brand-surface lg:inline-flex">
            Join SCESA
          </Button>
          <div className="lg:hidden">
            <MobileDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
