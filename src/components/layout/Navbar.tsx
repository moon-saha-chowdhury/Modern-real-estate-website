"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { mainNav, primaryCta } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { isActive } from "@/lib/utils/nav";
import { MobileNavigation } from "./MobileNavigation";
import { useSmoothScroll } from "@/lib/context/smooth-scroll";
import { Wordmark } from "./Wordmark";

/**
 * Global navigation.
 * - Transparent over the hero, solid obsidian after 24px of scroll.
 * - Hides on scroll down, returns on scroll up.
 * Scroll state is written to data-attributes directly (no React re-render per scroll event).
 */
export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();

  // Scroll-driven appearance, rAF-throttled.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      el.dataset.scrolled = String(y > 24);
      if (el.dataset.menu !== "open") {
        if (y > lastY + 4 && y > window.innerHeight * 0.6) el.dataset.hidden = "true";
        else if (y < lastY - 4 || y <= 24) el.dataset.hidden = "false";
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    smoothScroll.lock();
    return () => smoothScroll.unlock();
  }, [menuOpen, smoothScroll]);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  const toggleMenu = () => {
    if (headerRef.current) headerRef.current.dataset.hidden = "false";
    setMenuOpen((open) => !open);
  };

  // Escape to close + focus trap within the header while the menu is open.
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab" || !headerRef.current) return;
    const focusables = Array.from(
      headerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ).filter((node) => node.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      ref={headerRef}
      data-menu={menuOpen ? "open" : "closed"}
      data-surface="dark"
      onKeyDown={onKeyDown}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent text-ivory",
        "transition-[background-color,border-color,translate] duration-500 ease-meridian",
        "data-[scrolled=true]:border-line/70 data-[scrolled=true]:bg-obsidian/95",
        "data-[hidden=true]:-translate-y-full",
        "data-[menu=open]:border-transparent data-[menu=open]:bg-transparent",
      )}
    >
      <Container className="relative z-10 flex h-nav items-center justify-between gap-8">
        <Wordmark onClick={() => closeMenu()} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2 py-2 text-small transition-colors duration-300",
                      active ? "text-ivory" : "text-ivory/65 hover:text-ivory",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1 bg-brand transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-meridian group-hover:origin-left group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            href={primaryCta.href}
            variant="outline"
            icon
            className="hidden h-10 px-5 md:inline-flex"
          >
            {primaryCta.label}
          </Button>

          <button
            ref={toggleRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="-mr-2 flex h-11 items-center gap-3 px-2 label-mono lg:hidden"
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-6">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-meridian",
                  menuOpen ? "top-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px bg-current transition-all duration-500 ease-meridian",
                  menuOpen ? "top-1/2 w-full -rotate-45" : "top-full w-2/3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      <MobileNavigation open={menuOpen} pathname={pathname} onNavigate={() => closeMenu()} />
    </header>
  );
}
