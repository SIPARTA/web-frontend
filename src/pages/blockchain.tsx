"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const client = clientId && clientId !== "your_client_id_here" ? createThirdwebClient({ clientId }) : undefined;

const benefits = [
  "Wallet dipakai sebagai identitas tambahan.",
  "Siap untuk pencatatan peringatan ke Polygon Amoy.",
  "Akun email tetap tersedia untuk akses biasa.",
];

export default function BlockchainPage() {
  const router = useRouter();
  const account = useActiveAccount();

  useEffect(() => {
    if (account) router.push("/");
  }, [account, router]);

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="section-kicker">Akses Web3</p>
          <h1 className="section-title mt-3 mb-4">Hubungkan MetaMask</h1>
          <p className="leading-7 max-w-md" style={{ color: "var(--muted)" }}>
            Gunakan wallet sebagai identitas tambahan ketika SIPARTA membutuhkan pencatatan
            atau validasi berbasis Polygon Amoy.
          </p>
          <Link href="/signin" className="btn-secondary mt-6 w-fit text-sm">
            Masuk dengan email
          </Link>
        </div>

        <div className="desktop-panel p-6">
          <div className="mb-6 flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-extrabold" style={{ color: "var(--section-title)" }}>
              Konfigurasi wallet
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              SIPARTA - Sistem Pintar Deteksi Kimia Rumah Tangga
            </p>
          </div>
          <span className="brand-mark relative flex h-12 w-12 items-center justify-center rounded-lg">
            <Image src="/logo.png" alt="SIPARTA" width={38} height={38} className="object-contain" />
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <div className="module-card">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--muted)" }}>
                Status wallet
              </p>
              {account ? (
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Terhubung sebagai</p>
                  <p className="font-mono text-sm font-semibold break-all" style={{ color: "var(--section-title)" }}>
                    {account.address}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Belum terhubung</p>
                  <p className="font-semibold text-sm" style={{ color: "var(--section-title)" }}>
                    Pilih tombol di panel kanan untuk memulai.
                  </p>
                </div>
              )}
            </div>

            <div className="module-card">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--section-title)" }}>
                Kapan dipakai?
              </p>
              <ul className="space-y-2.5">
                {benefits.map((text) => (
                  <li key={text} className="text-sm leading-6" style={{ color: "var(--muted)" }}>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="soft-panel p-5 flex flex-col justify-center">
            {client ? (
              <>
                <ConnectButton
                  client={client}
                  chain={polygonAmoy}
                  connectButton={{
                    label: account ? "Terhubung" : "Hubungkan MetaMask",
                    className: "w-full btn-primary",
                  }}
                />
                <div className="mt-5 rounded-md p-4 text-sm leading-6 border" style={{ background: "var(--surface-soft)", borderColor: "var(--border-soft)", color: "var(--muted)" }}>
                  <p className="font-semibold mb-1" style={{ color: "var(--section-title)" }}>
                    Catatan
                  </p>
                  MetaMask bersifat opsional. Untuk masuk tanpa wallet, gunakan akun email.
                </div>
              </>
            ) : (
              <div className="rounded-md border border-orange-500/30 bg-orange-500/10 p-5 text-sm text-orange-700">
                <p className="font-semibold mb-2">Thirdweb Client ID belum dikonfigurasi.</p>
                <p className="leading-6 opacity-80">
                  Tambahkan <code className="rounded px-1.5 py-0.5 bg-black/10">NEXT_PUBLIC_THIRDWEB_CLIENT_ID</code> di{" "}
                  <code className="rounded px-1.5 py-0.5 bg-black/10">.env.local</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
