
import React, { useState } from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { name, email, subject, message } = formData;
      
      if (!name || !email || !subject || !message) {
        toast.error('Mohon isi semua bidang yang diperlukan');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        'https://uhksouubmomfegsoeltl.supabase.co/functions/v1/send-contact-form',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan saat mengirim formulir');
      }

      toast.success('Pesan Anda telah berhasil dikirim!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim formulir');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 via-indigo-900 to-purple-950">
      <Navbar />
      <main className="flex-1 p-6 pt-28">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Hubungi Kami</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Kami siap menjawab pertanyaan Anda tentang TourGenius. Jangan ragu untuk menghubungi kami.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">Nama</label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Nama Anda" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email</label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="alamat@email.com" 
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-white mb-2">Subjek</label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Subjek pesan Anda" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-white mb-2">Pesan</label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[150px]"
                      placeholder="Ketik pesan Anda di sini..." 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 mb-6">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">Informasi Kontak</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="text-xl text-white font-medium">Email</h3>
                      <p className="text-blue-100 mt-1">info@tourgenius.id</p>
                      <p className="text-blue-100">support@tourgenius.id</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="text-xl text-white font-medium">Telepon</h3>
                      <p className="text-blue-100 mt-1">+62 812 3456 7890</p>
                      <p className="text-blue-100">+62 878 9012 3456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="text-xl text-white font-medium">Alamat</h3>
                      <p className="text-blue-100 mt-1">
                        Jalan Raya Seminyak No. 45<br />
                        Kuta, Bali 80361<br />
                        Indonesia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">Jam Operasional</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Senin - Jumat:</span>
                    <span className="text-blue-100">09:00 - 17:00 WITA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Sabtu:</span>
                    <span className="text-blue-100">09:00 - 15:00 WITA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Minggu:</span>
                    <span className="text-blue-100">Tutup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
