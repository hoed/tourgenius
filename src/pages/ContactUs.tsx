
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
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
    
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Formulir tidak lengkap",
        description: "Harap isi semua kolom yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-form', {
        body: {
          name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (error) throw error;

      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera membalas.",
        variant: "default"
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Gagal mengirim pesan",
        description: "Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi nanti.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6 pt-20">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Hubungi Kami</h1>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Tim dukungan kami yang berdedikasi siap membantu Anda dengan pertanyaan, masalah teknis, atau umpan balik. Hubungi kami untuk memastikan perencanaan tur Anda berjalan lancar.
          </p>
          <div className="max-w-lg mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-700 font-medium">Nama Lengkap</label>
                <Input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda" 
                  className="bg-gray-50 border-gray-200" 
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Alamat Email</label>
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  placeholder="Masukkan email Anda" 
                  className="bg-gray-50 border-gray-200" 
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Subjek</label>
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="mis., Dukungan Teknis" 
                  className="bg-gray-50 border-gray-200" 
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Pesan</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Jelaskan pertanyaan atau masalah Anda" 
                  className="bg-gray-50 border-gray-200" 
                  rows={5} 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-400 text-gray-900 hover:bg-amber-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : "Kirim Pesan"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
