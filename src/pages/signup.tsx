"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Semua field harus diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    localStorage.setItem(
      "siparta_web2_user",
      JSON.stringify({ email, password, createdAt: new Date().toISOString() })
    );
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="section-kicker">Registrasi</p>
          <h1 className="section-title mt-3 mb-4">Buat akun SIPARTA</h1>
          <p className="leading-7 mb-6 max-w-md" style={{ color: "var(--muted)" }}>
            Gunakan akun email untuk menyimpan akses Sistem Pintar Deteksi Kimia Rumah Tangga.
            MetaMask tetap tersedia sebagai opsi tambahan untuk alur Web3.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Akses", value: "Akun email" },
              { label: "Data", value: "Tersimpan lokal" },
            ].map((item) => (
              <div key={item.label} className="rounded-md border p-4" style={{ background: "var(--surface-soft)", borderColor: "var(--border-soft)" }}>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  {item.label}
                </p>
                <p className="font-semibold text-sm" style={{ color: "var(--section-title)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="desktop-panel p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="eyebrow">Akun baru</span>
              <h2 className="text-xl font-extrabold mt-3" style={{ color: "var(--section-title)" }}>
                Daftar dengan email
              </h2>
            </div>
            <span className="brand-mark relative flex h-12 w-12 items-center justify-center rounded-lg">
              <Image src="/logo.png" alt="SIPARTA" width={38} height={38} className="object-contain" />
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="form-input"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="form-input"
                placeholder="Minimal 8 karakter"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Konfirmasi password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                className="form-input"
                placeholder="Ulangi password"
              />
            </div>

            {error && (
              <p className="text-sm rounded-md px-4 py-2.5 border border-red-500/30 bg-red-500/10 text-red-500">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full text-sm">
              Buat akun
            </button>
          </form>

          <div className="mt-6 pt-5 border-t space-y-3" style={{ borderColor: "var(--border-soft)" }}>
            <Link href="/blockchain" className="btn-secondary w-full text-sm">
              Daftar dengan MetaMask
            </Link>
            <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
              Sudah punya akun?{" "}
              <Link href="/signin" className="font-semibold hover:underline" style={{ color: "var(--teal-600)" }}>
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
