
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass, Users, Calendar, Receipt, Map, FileText, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Manual = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manual Pengguna</h1>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden md:inline">Ikhtisar</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden md:inline">Dasbor</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Pelanggan</span>
            </TabsTrigger>
            <TabsTrigger value="itineraries" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Rencana Perjalanan</span>
            </TabsTrigger>
            <TabsTrigger value="tourplans" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden md:inline">Paket Wisata</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden md:inline">Faktur</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Pengaturan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selamat Datang di Sistem Manajemen Pariwisata</CardTitle>
                <CardDescription>
                  Alat komprehensif untuk mengelola bisnis pariwisata Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sistem Manajemen Pariwisata membantu Anda merampingkan operasi bisnis pariwisata dengan menyediakan alat untuk mengelola pelanggan, membuat rencana perjalanan, menghasilkan faktur, dan lainnya.
                </p>
                <h3 className="text-xl font-semibold mt-4">Fitur Utama</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manajemen pelanggan</li>
                  <li>Pembuatan dan perencanaan rencana perjalanan</li>
                  <li>Template paket wisata</li>
                  <li>Pembuatan dan pelacakan faktur</li>
                  <li>Analitik bisnis dan pelaporan</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memulai</CardTitle>
                <CardDescription>
                  Langkah-langkah dasar untuk memulai dengan sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ikhtisar Dasbor</CardTitle>
                <CardDescription>
                  Memahami pusat kontrol utama Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Dasbor memberikan gambaran cepat tentang performa bisnis pariwisata Anda dan akses ke semua fitur sistem.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dashboard-1">
                    <AccordionTrigger>Metrik Utama</AccordionTrigger>
                    <AccordionContent>
                      Dasbor menampilkan metrik penting seperti penjualan terbaru, tur yang akan datang, faktur tertunda, dan statistik pelanggan untuk membantu Anda melacak performa bisnis secara sekilas.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dashboard-2">
                    <AccordionTrigger>Navigasi</AccordionTrigger>
                    <AccordionContent>
                      Menu sidebar memberi Anda akses cepat ke semua fitur termasuk pelanggan, rencana perjalanan, paket wisata, faktur, dan pengaturan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dashboard-3">
                    <AccordionTrigger>Tindakan Cepat</AccordionTrigger>
                    <AccordionContent>
                      Dasbor menyediakan tombol tindakan cepat untuk membuat rencana perjalanan baru, menambahkan pelanggan, menghasilkan faktur, dan lainnya.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pelanggan</CardTitle>
                <CardDescription>
                  Mengelola database pelanggan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bagian manajemen pelanggan memungkinkan Anda menambahkan, mengedit, dan melacak informasi pelanggan Anda dan riwayat pemesanan.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="customers-1">
                    <AccordionTrigger>Menambahkan Pelanggan Baru</AccordionTrigger>
                    <AccordionContent>
                      Klik tombol "Tambah Pelanggan" untuk membuka formulir. Isi detail pelanggan termasuk nama, email, telepon, dan alamat. Simpan informasi untuk menambahkan pelanggan ke database Anda.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="customers-2">
                    <AccordionTrigger>Mengedit Informasi Pelanggan</AccordionTrigger>
                    <AccordionContent>
                      Untuk mengedit informasi pelanggan, temukan mereka dalam daftar pelanggan dan klik tombol edit. Perbarui kolom yang diperlukan dan simpan perubahan Anda.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="customers-3">
                    <AccordionTrigger>Riwayat Pelanggan</AccordionTrigger>
                    <AccordionContent>
                      Lihat riwayat pemesanan pelanggan, rencana perjalanan sebelumnya, dan catatan faktur dengan mengklik profil mereka. Ini membantu Anda memberikan layanan yang lebih personal.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Rencana Perjalanan</CardTitle>
                <CardDescription>
                  Membuat dan mengelola rencana perjalanan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bagian rencana perjalanan memungkinkan Anda membuat rencana perjalanan detail dengan aktivitas hari per hari, akomodasi, dan transportasi.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="itineraries-1">
                    <AccordionTrigger>Membuat Rencana Perjalanan Baru</AccordionTrigger>
                    <AccordionContent>
                      Klik "Buat Rencana Perjalanan" untuk memulai rencana perjalanan baru. Tambahkan detail dasar seperti nama, tanggal, dan jumlah orang. Anda dapat membangun dari awal atau menggunakan paket wisata yang ada sebagai template.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-2">
                    <AccordionTrigger>Menambahkan Aktivitas Harian</AccordionTrigger>
                    <AccordionContent>
                      Untuk setiap hari, tambahkan destinasi, akomodasi, makanan, dan transportasi. Sistem akan menghitung biaya secara otomatis berdasarkan input Anda.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-3">
                    <AccordionTrigger>Menetapkan Pemandu Wisata</AccordionTrigger>
                    <AccordionContent>
                      Tambahkan pemandu wisata ke rencana perjalanan Anda dengan memilih dari database pemandu Anda. Anda dapat menetapkan pemandu tertentu berdasarkan keahlian, bahasa, dan ketersediaan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="itineraries-4">
                    <AccordionTrigger>Menghasilkan Faktur</AccordionTrigger>
                    <AccordionContent>
                      Setelah rencana perjalanan selesai, Anda dapat langsung menghasilkan faktur dengan mengklik tombol "Buat Faktur". Ini akan mentransfer semua detail harga yang relevan.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tourplans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Paket Wisata</CardTitle>
                <CardDescription>
                  Membuat template tur yang dapat digunakan kembali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Paket wisata berfungsi sebagai template yang dapat dengan cepat dikonversi menjadi rencana perjalanan lengkap, menghemat waktu Anda saat membuat perjalanan serupa.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tourplans-1">
                    <AccordionTrigger>Membuat Paket Wisata</AccordionTrigger>
                    <AccordionContent>
                      Klik "Buat Paket Wisata" dan isi detail dasar seperti judul, deskripsi, dan harga. Anda juga dapat menambahkan gambar sampul untuk membuatnya menarik secara visual.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tourplans-2">
                    <AccordionTrigger>Menambahkan Detail Rencana Perjalanan</AccordionTrigger>
                    <AccordionContent>
                      Beralih ke tab Detail Rencana Perjalanan untuk menambahkan informasi tentang tanggal mulai, jumlah orang, dan spesifik lainnya yang akan digunakan saat mengkonversi ke rencana perjalanan lengkap.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tourplans-3">
                    <AccordionTrigger>Mengkonversi ke Rencana Perjalanan</AccordionTrigger>
                    <AccordionContent>
                      Untuk mengkonversi paket wisata menjadi rencana perjalanan lengkap, klik tombol "Konversi ke Rencana Perjalanan" pada kartu paket wisata. Ini akan membuat rencana perjalanan baru dengan semua detail dari paket wisata Anda.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Faktur</CardTitle>
                <CardDescription>
                  Membuat dan melacak faktur pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bagian faktur memungkinkan Anda membuat, mengelola, dan melacak pembayaran untuk layanan perjalanan Anda.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="invoices-1">
                    <AccordionTrigger>Membuat Faktur Secara Manual</AccordionTrigger>
                    <AccordionContent>
                      Pilih "Input Manual" saat membuat faktur baru. Isi detail pelanggan, tambahkan item baris untuk layanan, tentukan harga, dan atur ketentuan pembayaran.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-2">
                    <AccordionTrigger>Membuat Faktur dari Rencana Perjalanan</AccordionTrigger>
                    <AccordionContent>
                      Pilih "Dari Rencana Perjalanan" untuk secara otomatis menghasilkan faktur berdasarkan rencana perjalanan yang ada. Sistem akan menarik semua detail dan harga yang relevan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-3">
                    <AccordionTrigger>Melacak Status Pembayaran</AccordionTrigger>
                    <AccordionContent>
                      Pantau status faktur (draft, terkirim, dibayar, belum dibayar) dan perbarui saat pembayaran diterima. Sistem memberikan gambaran yang jelas tentang pembayaran yang tertunda dan selesai.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="invoices-4">
                    <AccordionTrigger>Mengunduh dan Mencetak</AccordionTrigger>
                    <AccordionContent>
                      Hasilkan versi PDF dari faktur yang dapat diunduh, dicetak, atau dikirim langsung ke pelanggan melalui email.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
                <CardDescription>
                  Mengelola akun dan preferensi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bagian pengaturan memungkinkan Anda menyesuaikan akun Anda, memperbarui informasi bisnis, dan mengelola preferensi sistem.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="settings-1">
                    <AccordionTrigger>Manajemen Profil</AccordionTrigger>
                    <AccordionContent>
                      Perbarui informasi pribadi dan bisnis Anda, termasuk nama perusahaan, logo, detail kontak, dan alamat bisnis.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="settings-2">
                    <AccordionTrigger>Pengaturan Keamanan</AccordionTrigger>
                    <AccordionContent>
                      Ubah kata sandi Anda, aktifkan otentikasi dua faktor, dan kelola preferensi login untuk menjaga keamanan akun Anda.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="settings-3">
                    <AccordionTrigger>Preferensi Notifikasi</AccordionTrigger>
                    <AccordionContent>
                      Sesuaikan notifikasi mana yang Anda terima tentang pemesanan baru, pembayaran faktur, dan pembaruan sistem.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-amber-800">Butuh Bantuan Tambahan?</h3>
              <p className="text-amber-700 mt-2">
                Jika Anda memerlukan bantuan lebih lanjut atau memiliki pertanyaan spesifik tentang penggunaan sistem, silakan hubungi tim dukungan kami.
              </p>
              <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white">
                Hubungi Dukungan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;
