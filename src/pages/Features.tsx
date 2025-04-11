
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

const Features = () => {
  const features = [
    { 
      title: 'Perencanaan Rencana Perjalanan', 
      description: 'Rancang rencana perjalanan tur yang mendetail dan dapat disesuaikan dengan mudah.',
      icon: '📅' 
    },
    { 
      title: 'Pembuatan Faktur', 
      description: 'Buat faktur profesional dengan rincian biaya otomatis.',
      icon: '📄' 
    },
    { 
      title: 'Kolaborasi Real-Time', 
      description: 'Bekerja dengan tim Anda secara lancar dalam waktu nyata.',
      icon: '👥' 
    },
    { 
      title: 'Manajemen Pelanggan', 
      description: 'Lacak detail dan preferensi klien secara efisien.',
      icon: '👤' 
    },
    {
      title: 'Template Paket Wisata',
      description: 'Buat dan gunakan kembali template paket tur untuk penawaran yang sering diminta.',
      icon: '🗺️'
    },
    {
      title: 'Analitik Bisnis',
      description: 'Visualisasikan performa bisnis Anda dan pantau tren penjualan untuk pengambilan keputusan yang lebih baik.',
      icon: '📊'
    },
    {
      title: 'Multi-bahasa',
      description: 'Dukungan untuk bahasa Inggris dan Indonesia untuk melayani pasar internasional dan lokal.',
      icon: '🌐'
    },
    {
      title: 'Desain Responsif',
      description: 'Akses dan kelola bisnis Anda dari perangkat apa pun - desktop, tablet, atau ponsel.',
      icon: '📱'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 via-indigo-900 to-purple-950">
      <Navbar />
      <main className="flex-1 p-6 pt-28">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Fitur TourGenius</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Temukan alat-alat canggih yang menjadikan TourGenius platform terbaik untuk profesional pariwisata.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <CardTitle className="text-xl text-amber-400">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Siap untuk meningkatkan bisnis tur Anda?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/pricing" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium rounded-lg transition-colors">
                Lihat Harga
              </a>
              <a href="/auth?signup=true" className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors">
                Daftar Gratis
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
