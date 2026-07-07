"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTrainingProfile } from "@/components/TrainingProfileProvider";
import { Logo } from "@/components/Logo";
import { Button } from "./Button";

const links = [
  { href: "/journey", label: "Journey" },
  { href: "/study-plan", label: "Study Plan" },
  { href: "/mock", label: "Mock" },
  { href: "/train", label: "Train" },
  { href: "/problems", label: "Problems" },
  { href: "/patterns", label: "Patterns" },
  { href: "/dashboard", label: "Progress" },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { isAuthenticated, profile, logout } = useTrainingProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <Logo size={32} className="shrink-0" />
          <span className="text-lg font-semibold tracking-tight">
            Algo<span className="text-accent">lytics</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`hidden sm:block rounded-lg px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated && profile ? (
            <div className="ml-2 hidden sm:flex items-center gap-2">
              <Link
                href="/access"
                className="hidden md:block rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-accent transition-colors"
                title="Your training code"
              >
                ···{profile.codeHint}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Switch code
              </button>
            </div>
          ) : (
            <Button href="/access" size="sm" className="ml-2 hidden sm:inline-flex">
              Get Code
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden ml-2 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {links.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm ${
                  active
                    ? "bg-accent/10 font-medium text-accent"
                    : "text-muted hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated && profile ? (
            <div className="pt-3 border-t border-border space-y-2">
              <Link
                href="/access"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-2 font-mono text-xs text-muted"
              >
                Code ···{profile.codeHint}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-2 text-left text-sm text-muted hover:text-foreground"
              >
                Switch code
              </button>
            </div>
          ) : (
            <Link
              href="/access"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block w-full rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-background"
            >
              Get Code
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
