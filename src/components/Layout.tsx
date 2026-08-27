import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo } from "react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/signin", label: "Masuk" },
  { href: "/signup", label: "Daftar" },
  { href: "/blockchain", label: "MetaMask" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <header
        className="app-header sticky top-0 z-10 border-b"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="brand-mark flex h-10 w-10 items-center justify-center rounded-lg">
              <Image src="/logo.png" alt="SIPARTA" width={32} height={32} className="rounded-md" priority />
            </span>
            <div>
              <div className="font-bold leading-tight" style={{ color: "var(--section-title)" }}>
                SIPARTA
              </div>
              <div className="hidden text-xs sm:block" style={{ color: "var(--muted)" }}>
                Sistem Pintar Deteksi Kimia Rumah Tangga
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.href === "/blockchain" ? false : undefined}
                  className="nav-link rounded-md px-3 py-2 text-sm font-semibold"
                  style={
                    isActive
                      ? { background: "var(--nav-active-bg)", color: "var(--nav-active-text)" }
                      : { color: "var(--muted)" }
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</main>
    </div>
  );
}

export default memo(Layout);
