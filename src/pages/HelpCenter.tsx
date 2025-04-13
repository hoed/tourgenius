
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

const HelpCenter = () => {
  const faqCategories = [
    {
      title: 'Memulai',
      items: [
        { question: 'Bagaimana cara membuat itinerari pertama saya?', link: '#' },
        { question: 'Apa langkah-langkah untuk mengatur akun tim saya?', link: '#' },
        { question: 'Bagaimana cara menyesuaikan template faktur?', link: '#' },
      ],
    },
    {
      title: 'Pemecahan Masalah',
      items: [
        { question: 'Mengapa saya tidak bisa masuk ke akun saya?', link: '#' },
        { question: 'Apa yang harus dilakukan jika pemrosesan pembayaran gagal?', link: '#' },
        { question: 'Bagaimana mengatasi masalah sinkronisasi dalam mode kolaborasi?', link: '#' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 pt-20"> {/* Added pt-20 */}
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Pusat Bantuan</h1>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Akses sumber daya komprehensif dan dukungan ahli untuk memaksimalkan pengalaman TourGenius Anda. Cari basis pengetahuan kami atau hubungi untuk bantuan yang dipersonalisasi.
          </p>
          <div className="max-w-lg mx-auto mb-12">
            <div className="flex gap-2">
              <Input placeholder="Cari artikel bantuan (misalnya, 'pengaturan itinerari')" className="bg-gray-50 border-gray-200" />
              <Button className="bg-amber-400 text-gray-900 hover:bg-amber-500">Cari</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqCategories.map((category, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-amber-600 mb-4">{category.title}</h2>
                <ul className="text-gray-600 space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx}>
                      <a href={item.link} className="hover:text-amber-600">{item.question}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
