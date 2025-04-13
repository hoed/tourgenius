
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 pt-20"> {/* Added pt-20 */}
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Syarat dan Ketentuan</h1>
          <div className="prose text-gray-600">
            <p className="text-sm italic">Terakhir diperbarui: 22 Maret 2025</p>
            <h2 className="text-2xl text-amber-600 mt-6">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses atau menggunakan TourGenius, Anda setuju untuk terikat oleh Syarat dan Ketentuan ("Ketentuan") ini. Ketentuan ini mengatur penggunaan platform kami oleh Anda, termasuk semua fitur, alat, dan layanan yang disediakan.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">2. Penggunaan Layanan</h2>
            <p>
              Anda dapat menggunakan TourGenius untuk:
              <ul className="list-disc pl-6">
                <li>Membuat dan mengelola itinerari tur.</li>
                <li>Menghasilkan faktur dan memproses pembayaran.</li>
                <li>Berkolaborasi dengan anggota tim dan klien.</li>
              </ul>
              Anda setuju untuk tidak menyalahgunakan layanan kami, termasuk terlibat dalam aktivitas ilegal atau melanggar hak kekayaan intelektual.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">3. Langganan dan Pembayaran</h2>
            <p>
              TourGenius menawarkan paket langganan sebagaimana diuraikan dalam bagian Harga kami. Pembayaran diproses setiap bulan, dan semua biaya tidak dapat dikembalikan kecuali jika dinyatakan secara eksplisit. Kegagalan untuk membayar dapat mengakibatkan penangguhan akun Anda.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">4. Penghentian</h2>
            <p>
              Kami berhak untuk menghentikan atau menangguhkan akun Anda karena pelanggaran Ketentuan ini, dengan atau tanpa pemberitahuan. Setelah penghentian, akses Anda ke data yang disimpan mungkin dibatasi.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
