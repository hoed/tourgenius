
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'IDR 150.000/bulan',
      features: [
        '1 Akun Pengguna',
        'Hingga 5 Rencana Perjalanan per Bulan',
        'Dukungan Email Standar (respon 48 jam)',
        'Template Faktur Dasar',
      ],
      popular: false,
      buttonText: 'Mulai Sekarang'
    },
    {
      name: 'Pro',
      price: 'IDR 350.000/bulan',
      features: [
        'Hingga 5 Akun Pengguna',
        'Rencana Perjalanan Tak Terbatas',
        'Dukungan Email & Chat Prioritas (respon 24 jam)',
        'Kustomisasi Faktur Lanjutan',
        'Alat Kolaborasi Real-Time',
        'Analitik Dasar'
      ],
      popular: true,
      buttonText: 'Mulai Sekarang'
    },
    {
      name: 'Enterprise',
      price: 'Hubungi Kami',
      features: [
        'Akun Pengguna Tak Terbatas',
        'Fitur Rencana Perjalanan & Faktur Kustom',
        'Manajer Akun Khusus',
        'Dukungan Telepon & Prioritas 24/7',
        'Akses API untuk Integrasi',
        'Analitik Bisnis Lanjutan'
      ],
      popular: false,
      buttonText: 'Hubungi Sales'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 via-indigo-900 to-purple-950">
      <Navbar />
      <main className="flex-1 p-6 pt-28">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Harga Sederhana & Transparan</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Pilih paket yang disesuaikan dengan kebutuhan bisnis pariwisata Anda. Dari operator solo hingga agen besar, TourGenius menawarkan solusi yang dapat disesuaikan dengan harga transparan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-white/20'} bg-white/10 backdrop-blur-sm text-white relative overflow-hidden`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-gray-900 px-3 py-1 text-sm font-medium">Populer</div>
                )}
                <CardHeader className={`${plan.popular ? 'bg-white/10' : ''}`}>
                  <CardTitle className="text-xl text-amber-400">{plan.name}</CardTitle>
                  <p className="text-2xl font-bold text-white mt-2">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="text-blue-100 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-amber-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${plan.popular ? 'bg-amber-400 text-gray-900 hover:bg-amber-500' : 'bg-white/20 hover:bg-white/30'}`}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-20 text-center max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Butuh Solusi Kustom?</h2>
            <p className="text-blue-100 mb-6">
              Tim kami siap membantu Anda merancang paket yang tepat untuk kebutuhan spesifik bisnis pariwisata Anda. Dapatkan konsultasi gratis dengan ahli kami.
            </p>
            <Button className="bg-white text-indigo-900 hover:bg-blue-100">
              Jadwalkan Konsultasi Gratis
            </Button>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-blue-200 mb-4">Pertanyaan tentang paket kami?</p>
            <a href="/contact-us" className="text-amber-400 hover:text-amber-300 font-medium">
              Hubungi tim sales kami →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
