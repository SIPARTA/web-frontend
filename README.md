# Rancang Bangun Deteksi dan Peringatan Dini Gas Beracun dari Reaksi Kimia Rumah Tangga Berbasis Jaringan Syaraf Tiruan

Aplikasi web Next.js premium untuk sistem peringatan dini gas beracun PKM-KC yang terhubung ke blockchain Polygon Amoy melalui ThirdWeb SDK.

## Fitur Utama
- ✨ **Premium Design**: Tampilan modern dengan glassmorphism dan animatied gradients.
- 🦊 **MetaMask Login**: Autentikasi aman menggunakan MetaMask wallet.
- 🌐 **Polygon Amoy**: Terintegrasi langsung dengan testnet Polygon Amoy.

## Persiapan
1. **Dapatkan Client ID**:
   - Buka [thirdweb.com/dashboard](https://thirdweb.com/dashboard/settings/api-keys).
   - Buat API Key baru.
   - Copy `Client ID`.

2. **Setup .env.local**:
   - Buka file `.env.local`.
   - Ganti `your_client_id_here` dengan Client ID yang sudah didapat.

3. **Setup MetaMask**:
   - Pastikan MetaMask terinstal di browser.
   - Tambahkan network Polygon Amoy jika belum ada.

## Cara Menjalankan
1. Install dependencies (jika belum):
   ```bash
   npm install
   ```
2. Jalankan server development:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Tech Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS & Vanilla CSS
- **Web3 SDK**: ThirdWeb v5
- **Network**: Polygon Amoy Testnet
