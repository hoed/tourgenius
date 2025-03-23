
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="space-y-6 max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-gradient animate-fade-up">
                Buat Pengalaman Perjalanan Luar Biasa
                <span className="block text-sm mt-2 text-blue-300">(Create Extraordinary Travel Experiences)</span>
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed animate-fade-up animation-delay-150">
                Rencanakan, sesuaikan, dan kelola rencana perjalanan dengan presisi. Hitung biaya secara otomatis, dan hasilkan faktur profesional dalam hitungan detik.
                <span className="block text-sm mt-1 text-blue-300">(Plan, customize, and manage tour itineraries with precision. Calculate costs automatically, and generate professional invoices in seconds.)</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start animate-fade-up animation-delay-300">
                <Link to="/auth?signup=true">
                  <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none">
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/#features">
                  <Button size="lg" variant="outline" className="text-blue-700 border-blue-500/50 hover:bg-blue-900/20">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 animate-fade-in animation-delay-500">
            <GlassCard className="relative overflow-hidden border border-blue-400/20 bg-blue-950/30 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Dashboard Preview"
                className="w-full h-auto rounded object-cover shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900/80 to-transparent backdrop-blur-sm rounded-b-lg">
                <p className="text-sm font-medium text-blue-100">Pratinjau dashboard: Pembuat rencana perjalanan</p>
              </div>
            </GlassCard>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <GlassCard className="animate-float bg-blue-950/30 backdrop-blur-sm border border-blue-400/20">
                <div className="flex flex-col items-center p-2 text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">2,500+</div>
                  <p className="text-sm text-blue-300">Tur Dibuat</p>
                </div>
              </GlassCard>
              <GlassCard className="animate-float animation-delay-150 bg-blue-950/30 backdrop-blur-sm border border-blue-400/20">
                <div className="flex flex-col items-center p-2 text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">98%</div>
                  <p className="text-sm text-blue-300">Kepuasan Pelanggan</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
