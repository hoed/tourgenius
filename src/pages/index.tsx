
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-indigo-900 to-purple-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-float animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIwLjUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
