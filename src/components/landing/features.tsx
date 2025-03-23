import React from 'react';
import GlassCard from '@/components/ui/glass-card';
import { Calendar, DollarSign, FileText, Map, Settings, Users } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-blue-900" />,
    title: 'Pembuat Rencana Perjalanan Cerdas',
    description: 'Rencanakan aktivitas harian dengan mudah menggunakan antarmuka tarik-dan-lepas. Sesuaikan setiap aspek tur Anda.'
  },
  {
    icon: <Map className="h-10 w-10 text-blue-900" />,
    title: 'Manajemen Destinasi',
    description: 'Tambahkan atraksi, aktivitas, dan tempat menarik dengan informasi detail dan harga.'
  },
  {
    icon: <Users className="h-10 w-10 text-blue-900" />,
    title: 'Penugasan Pemandu Wisata',
    description: 'Pilih dari pemandu yang berkualifikasi berdasarkan keahlian, bahasa, dan ketersediaan.'
  },
  {
    icon: <DollarSign className="h-10 w-10 text-blue-900" />,
    title: 'Kalkulasi Harga Otomatis',
    description: 'Pembaruan biaya secara real-time saat Anda membuat rencana perjalanan, dengan rincian lengkap untuk semua komponen.'
  },
  {
    icon: <FileText className="h-10 w-10 text-blue-900" />,
    title: 'Faktur Profesional',
    description: 'Buat faktur bermerek dan terperinci yang dapat dikirim langsung ke klien dengan opsi pembayaran.'
  },
  {
    icon: <Settings className="h-10 w-10 text-blue-900" />,
    title: 'Opsi Penyesuaian',
    description: 'Sesuaikan makanan, akomodasi, dan transportasi untuk memenuhi preferensi dan anggaran klien tertentu.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-8">
            Fitur Canggih untuk Profesional Tur
          </h2>
          <p className="text-blue-900 leading-relaxed">
            Semua alat yang Anda butuhkan untuk menciptakan pengalaman perjalanan luar biasa bagi klien Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              className="flex flex-col items-start h-full bg-blue-950/30 backdrop-blur-sm border border-blue-400/20 transition-all duration-300"
              hoverEffect={true}
            >
              <div className="mb-4 p-3 bg-white rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">
                {feature.title}
              </h3>
              <p className="text-blue-900">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;