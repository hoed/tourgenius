
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Compass, Users, Calendar, Receipt, Map, FileText, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';

const Manual: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Manual Pengguna
          </h1>
          <p className="text-gray-600 mt-2">
            Panduan lengkap untuk menggunakan platform TourGenius
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap justify-start gap-2 mb-6 sm:mb-8 bg-gray-200/50 p-2 rounded-lg">
            {[
              { value: 'overview', icon: Compass, label: 'Ikhtisar' },
              { value: 'dashboard', icon: Map, label: 'Dasbor' },
              { value: 'customers', icon: Users, label: 'Pelanggan' },
              { value: 'itineraries', icon: Calendar, label: 'Rencana Perjalanan' },
              { value: 'tourplans', icon: Map, label: 'Paket Wisata' },
              { value: 'invoices', icon: Receipt, label: 'Faktur' },
              { value: 'settings', icon: Settings, label: 'Pengaturan' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-none min-w-[80px]"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Selamat Datang di Sistem Manajemen Pariwisata
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Alat komprehensif untuk mengelola bisnis pariwisata Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Sistem Manajemen Pariwisata membantu Anda merampingkan operasi bisnis pariwisata dengan menyediakan alat untuk mengelola pelanggan, membuat rencana perjalanan, menghasilkan faktur, dan lainnya.
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mt-4">Fitur Utama</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manajemen pelanggan</li>
                  <li>Pembuatan dan perencanaan rencana perjalanan</li>
                  <li>Template paket wisata</li>
                  <li>Pembuatan dan pelacakan faktur</li>
                  <li>Analitik bisnis dan pelaporan</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">Memulai</CardTitle>
                <CardDescription className="text-gray-600">
                  Langkah-langkah dasar untuk memulai dengan sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Daftar/Masuk:</strong> Buat akun atau masuk untuk mengakses dasbor.
                  </li>
                  <li>
                    <strong>Siapkan Profil Anda:</strong> Perbarui detail bisnis Anda di bagian pengaturan.
                  </li>
                  <li>
                    <strong>Tambahkan Pelanggan:</strong> Mulai membangun database pelanggan Anda.
                  </li>
                  <li>
                    <strong>Buat Paket Wisata:</strong> Desain template tur yang dapat digunakan kembali.
                  </li>
                  <li>
                    <strong>Buat Rencana Perjalanan:</strong> Buat rencana perjalanan detail untuk pelanggan Anda.
                  </li>
                  <li>
                    <strong>Hasilkan Faktur:</strong> Buat dan kirim faktur profesional kepada pelanggan Anda.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">Ikhtisar Dasbor</CardTitle>
                <CardDescription className="text-gray-600">
                  Memahami pusat kontrol utama Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Dasbor memberikan gambaran cepat tentang performa bisnis pariwisata Anda dan akses ke semua fitur sistem.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'dashboard-1',
                      trigger: 'Metrik Utama',
                      content:
                        'Dasbor menampilkan metrik penting seperti penjualan terbaru, tur yang akan datang, faktur tertunda, dan statistik pelanggan untuk membantu Anda melacak performa bisnis secara sekilas.',
                    },
                    {
                      id: 'dashboard-2',
                      trigger: 'Navigasi',
                      content:
                        'Menu sidebar memberi Anda akses cepat ke semua fitur termasuk pelanggan, rencana perjalanan, paket wisata, faktur, dan pengaturan.',
                    },
                    {
                      id: 'dashboard-3',
                      trigger: 'Tindakan Cepat',
                      content:
                        'Dasbor menyediakan tombol tindakan cepat untuk membuat rencana perjalanan baru, menambahkan pelanggan, menghasilkan faktur, dan lainnya.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Manajemen Pelanggan
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Mengelola database pelanggan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Bagian manajemen pelanggan memungkinkan Anda menambahkan, mengedit, dan melacak informasi pelanggan Anda dan riwayat pemesanan.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'customers-1',
                      trigger: 'Menambahkan Pelanggan Baru',
                      content:
                        'Klik tombol "Tambah Pelanggan" untuk membuka formulir. Isi detail pelanggan termasuk nama, email, telepon, dan alamat. Simpan informasi untuk menambahkan pelanggan ke database Anda.',
                    },
                    {
                      id: 'customers-2',
                      trigger: 'Mengedit Informasi Pelanggan',
                      content:
                        'Untuk mengedit informasi pelanggan, temukan mereka dalam daftar pelanggan dan klik tombol edit. Perbarui kolom yang diperlukan dan simpan perubahan Anda.',
                    },
                    {
                      id: 'customers-3',
                      trigger: 'Riwayat Pelanggan',
                      content:
                        'Lihat riwayat pemesanan pelanggan, rencana perjalanan sebelumnya, dan catatan faktur dengan mengklik profil mereka. Ini membantu Anda memberikan layanan yang lebih personal.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itineraries Tab */}
          <TabsContent value="itineraries" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Manajemen Rencana Perjalanan
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Membuat dan mengelola rencana perjalanan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Bagian rencana perjalanan memungkinkan Anda membuat rencana perjalanan detail dengan aktivitas hari per hari, akomodasi, dan transportasi.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'itineraries-1',
                      trigger: 'Membuat Rencana Perjalanan Baru',
                      content:
                        'Klik "Buat Rencana Perjalanan" untuk memulai rencana perjalanan baru. Tambahkan detail dasar seperti nama, tanggal, dan jumlah orang. Anda dapat membangun dari awal atau menggunakan paket wisata yang ada sebagai template.',
                    },
                    {
                      id: 'itineraries-2',
                      trigger: 'Menambahkan Aktivitas Harian',
                      content:
                        'Untuk setiap hari, tambahkan destinasi, akomodasi, makanan, dan transportasi. Sistem akan menghitung biaya secara otomatis berdasarkan input Anda.',
                    },
                    {
                      id: 'itineraries-3',
                      trigger: 'Menetapkan Pemandu Wisata',
                      content:
                        'Tambahkan pemandu wisata ke rencana perjalanan Anda dengan memilih dari database pemandu Anda. Anda dapat menetapkan pemandu tertentu berdasarkan keahlian, bahasa, dan ketersediaan.',
                    },
                    {
                      id: 'itineraries-4',
                      trigger: 'Menghasilkan Faktur',
                      content:
                        'Setelah rencana perjalanan selesai, Anda dapat langsung menghasilkan faktur dengan mengklik tombol "Buat Faktur". Ini akan mentransfer semua detail harga yang relevan.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tour Plans Tab */}
          <TabsContent value="tourplans" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Manajemen Paket Wisata
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Membuat template tur yang dapat digunakan kembali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Paket wisata berfungsi sebagai template yang dapat dengan cepat dikonversi menjadi rencana perjalanan lengkap, menghemat waktu Anda saat membuat perjalanan serupa.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'tourplans-1',
                      trigger: 'Membuat Paket Wisata',
                      content:
                        'Klik "Buat Paket Wisata" dan isi detail dasar seperti judul, deskripsi, dan harga. Anda juga dapat menambahkan gambar sampul untuk membuatnya menarik secara visual.',
                    },
                    {
                      id: 'tourplans-2',
                      trigger: 'Menambahkan Detail Rencana Perjalanan',
                      content:
                        'Beralih ke tab Detail Rencana Perjalanan untuk menambahkan informasi tentang tanggal mulai, jumlah orang, dan spesifik lainnya yang akan digunakan saat mengkonversi ke rencana perjalanan lengkap.',
                    },
                    {
                      id: 'tourplans-3',
                      trigger: 'Mengkonversi ke Rencana Perjalanan',
                      content:
                        'Untuk mengkonversi paket wisata menjadi rencana perjalanan lengkap, klik tombol "Konversi ke Rencana Perjalanan" pada kartu paket wisata. Ini akan membuat rencana perjalanan baru dengan semua detail dari paket wisata Anda.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Manajemen Faktur
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Membuat dan melacak faktur pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Bagian faktur memungkinkan Anda membuat, mengelola, dan melacak pembayaran untuk layanan perjalanan Anda.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'invoices-1',
                      trigger: 'Membuat Faktur Secara Manual',
                      content:
                        'Pilih "Input Manual" saat membuat faktur baru. Isi detail pelanggan, tambahkan item baris untuk layanan, tentukan harga, dan atur ketentuan pembayaran.',
                    },
                    {
                      id: 'invoices-2',
                      trigger: 'Membuat Faktur dari Rencana Perjalanan',
                      content:
                        'Pilih "Dari Rencana Perjalanan" untuk secara otomatis menghasilkan faktur berdasarkan rencana perjalanan yang ada. Sistem akan menarik semua detail dan harga yang relevan.',
                    },
                    {
                      id: 'invoices-3',
                      trigger: 'Melacak Status Pembayaran',
                      content:
                        'Pantau status faktur (draft, terkirim, dibayar, belum dibayar) dan perbarui saat pembayaran diterima. Sistem memberikan gambaran yang jelas tentang pembayaran yang tertunda dan selesai.',
                    },
                    {
                      id: 'invoices-4',
                      trigger: 'Mengunduh dan Mencetak',
                      content:
                        'Hasilkan versi PDF dari faktur yang dapat diunduh, dicetak, atau dikirim langsung ke pelanggan melalui email.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-gray-800">
                  Pengaturan Akun
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Mengelola akun dan preferensi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Bagian pengaturan memungkinkan Anda menyesuaikan akun Anda, memperbarui informasi bisnis, dan mengelola preferensi sistem.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      id: 'settings-1',
                      trigger: 'Manajemen Profil',
                      content:
                        'Perbarui informasi pribadi dan bisnis Anda, termasuk nama perusahaan, logo, detail kontak, dan alamat bisnis.',
                    },
                    {
                      id: 'settings-2',
                      trigger: 'Pengaturan Keamanan',
                      content:
                        'Ubah kata sandi Anda, aktifkan otentikasi dua faktor, dan kelola preferensi login untuk menjaga keamanan akun Anda.',
                    },
                    {
                      id: 'settings-3',
                      trigger: 'Preferensi Notifikasi',
                      content:
                        'Sesuaikan notifikasi mana yang Anda terima tentang pemesanan baru, pembayaran faktur, dan pembaruan sistem.',
                    },
                  ].map(({ id, trigger, content }) => (
                    <AccordionItem key={id} value={id}>
                      <AccordionTrigger className="text-base sm:text-lg hover:text-blue-600">
                        {trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <HelpCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-medium text-blue-800">
                Butuh Bantuan Tambahan?
              </h3>
              <p className="text-blue-700 mt-2 leading-relaxed">
                Jika Anda memerlukan bantuan lebih lanjut atau memiliki pertanyaan spesifik tentang penggunaan sistem, silakan hubungi tim dukungan kami.
              </p>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                asChild
              >
                <a href="mailto:support@tourgenius.com">Hubungi Dukungan</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Manual;
