import Link from "next/link";
import { NAV, SITE } from "@/config/site";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";

// A row of filled tiles: mark, links, and the one action.
export default function SiteHeader() {
  return (
    <header className="p-[var(--gap)] pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-accent focus:p-3 focus:text-accent-ink">
        Skip to content
      </a>
      <div className="flex min-h-[60px] gap-[var(--gap)]">
        <Link href="/" className="flex w-[60px] shrink-0 items-center justify-center bg-oak text-accent" aria-label={`${SITE.name} home`}>
          <Mark className="h-8 w-8" />
        </Link>
        <Link href="/" className="hidden items-center whitespace-nowrap bg-surface px-5 text-body no-underline sm:flex lg:hidden">
          {SITE.name}
        </Link>
        <nav aria-label="Main" className="hidden flex-1 items-center bg-surface lg:flex">
          <Link href="/" className="whitespace-nowrap px-5 text-body no-underline">
            {SITE.name}
          </Link>
          <ul className="ml-auto flex items-center gap-6 whitespace-nowrap pr-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-body no-underline hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="group relative flex-1 bg-surface sm:flex-none lg:hidden">
          <summary className="flex h-full min-h-[60px] cursor-pointer list-none items-center px-5 text-body [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav aria-label="Main" className="absolute left-0 right-0 top-full z-40 mt-[var(--gap)] bg-surface-2 p-5 sm:left-auto sm:w-72">
            <ul className="space-y-3">
              <li>
                <Link href="/map" className="text-lead no-underline">Explore the map</Link>
              </li>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-lead no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
        <Link href="/map" className="hidden shrink-0 items-center bg-ink px-6 text-body text-ground no-underline transition-colors hover:bg-oak hover:text-oak-ink sm:flex">
          Explore the map
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
