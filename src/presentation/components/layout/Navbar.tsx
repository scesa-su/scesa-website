import { CONTAINER } from "@/lib/styles";
import { Button } from "@/presentation/components/ui/Button";
import { Logo } from "./Logo";
import { MobileDrawer } from "./MobileDrawer";
import { NavLinks } from "./NavLinks";
import { NavShell } from "./NavShell";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <NavShell>
      <div
        className={`${CONTAINER} flex h-20 items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo group-data-condensed/nav:h-16 lg:h-24 lg:group-data-condensed/nav:h-16`}
      >
        <Logo />
        <div className="flex items-center lg:gap-12 xl:gap-16">
          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2 lg:gap-4">
            <ThemeToggle />
            <Button href="/join" size="lg" className="hidden focus-visible:ring-offset-brand-surface lg:inline-flex">
              Join SCESA
            </Button>
            <div className="lg:hidden">
              <MobileDrawer />
            </div>
          </div>
        </div>
      </div>
    </NavShell>
  );
}
