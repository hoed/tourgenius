
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 pt-20"> {/* Added pt-20 */}
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Kebijakan Privasi</h1>
          <div className="prose text-gray-600">
            <p className="text-sm italic">Terakhir diperbarui: 22 Maret 2025</p>
            <h2 className="text-2xl text-amber-600 mt-6">1. Pendahuluan</h2>
            <p>
              Di TourGenius, kami berkomitmen untuk melindungi privasi pengguna kami. Kebijakan Privasi ini menguraikan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda ketika Anda menggunakan platform perencanaan tur kami dan layanan terkait.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">2. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami, termasuk:
              <ul className="list-disc pl-6">
                <li><strong>Data Pribadi:</strong> Nama, alamat email, nomor telepon, dan detail pembayaran yang diberikan selama pembuatan akun atau transaksi.</li>
                <li><strong>Data Penggunaan:</strong> Informasi tentang bagaimana Anda berinteraksi dengan platform kami, seperti detail itinerari, alamat IP, dan jenis browser.</li>
                <li><strong>Data Klien:</strong> Informasi yang Anda masukkan tentang pelanggan Anda untuk tujuan manajemen tur.</li>
              </ul>
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>
              Data Anda memungkinkan kami untuk:
              <ul className="list-disc pl-6">
                <li>Memfasilitasi pembuatan itinerari, pembuatan faktur, dan manajemen pelanggan.</li>
                <li>Memproses pembayaran dengan aman melalui penyedia pihak ketiga terpercaya.</li>
                <li>Meningkatkan platform kami melalui analitik dan umpan balik pengguna.</li>
                <li>Berkomunikasi dengan Anda mengenai pembaruan, dukungan, dan penawaran promosi (dengan persetujuan Anda).</li>
              </ul>
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">4. Berbagi Data dan Keamanan</h2>
            <p>
              Kami tidak menjual informasi pribadi Anda. Data dapat dibagikan dengan:
              <ul className="list-disc pl-6">
                <li>Penyedia layanan (misalnya, pemroses pembayaran) di bawah perjanjian kerahasiaan yang ketat.</li>
                <li>Otoritas hukum jika diwajibkan oleh hukum.</li>
              </ul>
              Kami menggunakan enkripsi standar industri dan langkah-langkah keamanan untuk melindungi data Anda dari akses yang tidak sah.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
