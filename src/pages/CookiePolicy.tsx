
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

const CookiePolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 pt-20"> {/* Added pt-20 */}
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Kebijakan Cookie</h1>
          <div className="prose text-gray-600">
            <p className="text-sm italic">Terakhir diperbarui: 22 Maret 2025</p>
            <h2 className="text-2xl text-amber-600 mt-6">1. Pengenalan Cookie</h2>
            <p>
              TourGenius menggunakan cookie—file teks kecil yang disimpan di perangkat Anda—untuk meningkatkan pengalaman Anda di platform kami. Kebijakan Cookie ini menjelaskan cookie apa yang kami gunakan, mengapa kami menggunakannya, dan bagaimana Anda dapat mengelolanya.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">2. Jenis Cookie yang Kami Gunakan</h2>
            <p>
              Kami menggunakan cookie berikut:
              <ul className="list-disc pl-6">
                <li><strong>Cookie Esensial:</strong> Diperlukan untuk fungsi inti, seperti otentikasi pengguna dan manajemen sesi.</li>
                <li><strong>Cookie Analitik:</strong> Mengumpulkan data anonim untuk menganalisis penggunaan platform dan meningkatkan kinerja.</li>
                <li><strong>Cookie Pemasaran:</strong> Memungkinkan konten dan iklan yang dipersonalisasi (opsional, dengan persetujuan Anda).</li>
              </ul>
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">3. Mengelola Preferensi Cookie Anda</h2>
            <p>
              Anda dapat mengontrol cookie melalui pengaturan browser Anda, meskipun menonaktifkan cookie esensial dapat mengganggu fungsi platform. Untuk kontrol lebih lanjut, sesuaikan preferensi Anda di pengaturan akun TourGenius Anda jika berlaku.
            </p>
            <h2 className="text-2xl text-amber-600 mt-6">4. Cookie Pihak Ketiga</h2>
            <p>
              Kami mungkin mengintegrasikan layanan pihak ketiga (misalnya, penyedia analitik) yang mengatur cookie mereka sendiri. Ini diatur oleh kebijakan privasi masing-masing penyedia.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
