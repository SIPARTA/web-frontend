"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    const stored = localStorage.getItem("siparta_web2_user");
    if (!stored) {
      setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
      return;
    }

    const user = JSON.parse(stored);
    if (user.email !== email || user.password !== password) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-8 py-8 lg:grid-cols-[0.92fr_1fr]">
      <div className="hidden lg:block">
        <p className="section-kicker">Akses pengguna</p>
        <h1 className="section-title mt-3">Masuk ke SIPARTA</h1>
        <p className="mt-4 max-w-md leading-7" style={{ color: "var(--muted)" }}>
          Gunakan akun yang sudah dibuat untuk kembali ke Sistem Pintar Deteksi Kimia Rumah
          Tangga.
        </p>
        <div className="mt-6 soft-panel p-5">
          <p className="text-sm font-bold" style={{ color: "var(--section-title)" }}>
            Pemeriksaan cepat
          </p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Cek risiko campuran bahan pembersih dengan informasi yang singkat dan mudah dibaca.
          </p>
        </div>
      </div>

      <div className="desktop-panel p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="brand-mark relative flex h-12 w-12 items-center justify-center rounded-lg">
            <Image src="/logo.png" alt="SIPARTA" width={38} height={38} className="object-contain" priority />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: "var(--section-title)" }}>
              Masuk
            </h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              SIPARTA - Sistem Pintar Deteksi Kimia Rumah Tangga
            </p>
          </div>
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
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <p className="text-sm rounded-md px-4 py-2.5 border border-red-500/30 bg-red-500/10 text-red-500">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full text-sm">
            Masuk
          </button>
        </form>

        <div className="mt-6 pt-5 border-t space-y-3" style={{ borderColor: "var(--border-soft)" }}>
          <Link href="/blockchain" className="btn-secondary w-full text-sm">
            Masuk dengan MetaMask
          </Link>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--muted)" }}>Belum punya akun?</span>
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: "var(--teal-600)" }}>
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
