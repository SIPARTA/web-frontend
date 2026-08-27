"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { polygonAmoy } from "thirdweb/chains";
import { useRouter } from "next/router";
import { useEffect } from "react";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const hasThirdwebClientId = Boolean(clientId && clientId !== "your_client_id_here");
const client = clientId && clientId !== "your_client_id_here" ? createThirdwebClient({ clientId }) : undefined;

const wallets = [createWallet("io.metamask")];

export default function MetaMaskAuth() {
  const router = useRouter();
  const account = useActiveAccount();

  useEffect(() => {
    if (account) router.push("/");
  }, [account, router]);

  if (!hasThirdwebClientId || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="glass-card max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--section-title)" }}>
            Konfigurasi Thirdweb belum lengkap
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Tambahkan <code className="rounded bg-black/10 px-2 py-1">NEXT_PUBLIC_THIRDWEB_CLIENT_ID</code> ke file <code className="rounded bg-black/10 px-2 py-1">.env.local</code>.
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Aplikasi tetap bisa digunakan dengan akun email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectButton
        client={client}
        wallets={wallets}
        chain={polygonAmoy}
        connectButton={{
          label: "Hubungkan MetaMask",
          className: "btn-primary",
        }}
        appMetadata={{
          name: "SIPARTA",
          url: "https://siparta.example.com",
        }}
      />
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Hubungkan wallet untuk mengakses SIPARTA.
      </p>
    </div>
  );
}
