"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { company } from "@/data/company";
import { DURATION, EASE_MERIDIAN, EASE_MERIDIAN_IN_OUT } from "@/lib/animations/eases";
import { mainNav, primaryCta } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { isActive } from "@/lib/utils/nav";
import type { MobileNavigationProps } from "@/types/ui";

/**
 * Full-screen editorial menu (below lg). The panel wipes down like a drawing sheet,
 * then numbered serif links rise in sequence.
 */
export function MobileNavigation({ open, pathname, onNavigate }: MobileNavigationProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => firstLinkRef.current?.focus(), DURATION.ui * 600);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-surface pt-nav lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: DURATION.reveal, ease: EASE_MERIDIAN_IN_OUT }}
        >
          <Container className="flex flex-1 flex-col justify-between gap-12 pt-10 pb-8">
            <nav aria-label="Mobile">
              <ul className="border-t border-rule">
                {mainNav.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href} className="overflow-hidden border-b border-rule">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%", transition: { duration: 0.3 } }}
                        transition={{
                          duration: DURATION.reveal,
                          ease: EASE_MERIDIAN,
                          delay: 0.25 + i * 0.06,
                        }}
                      >
                        <Link
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={item.href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-baseline justify-between py-4"
                        >
                          <span
                            className={cn(
                              "font-display text-[clamp(2.5rem,11vw,4rem)] leading-none transition-colors",
                              active ? "text-fg italic" : "text-fg/80 group-hover:text-fg",
                            )}
                          >
                            {item.label}
                          </span>
                          <span
                            className={cn("label-mono", active ? "text-accent" : "text-fg-muted")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              className="flex flex-col gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: DURATION.reveal, delay: 0.6 }}
            >
              <Button
                href={primaryCta.href}
                icon
                onClick={onNavigate}
                className="w-full justify-between"
              >
                {primaryCta.label}
              </Button>
              <p className="text-small text-fg-muted">{company.description}</p>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
