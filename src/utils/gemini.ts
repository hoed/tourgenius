
// Gemini AI integration with GoogleGenAI library
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCMHA5m4CLdcIok9OOto5q-HbNiKn27GJU";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Knowledge base context extracted from the manual page
const knowledgeBase = `
# Manual Pengguna TourGenius

## Ikhtisar Sistem
Sistem Manajemen Pariwisata TourGenius membantu Anda merampingkan operasi bisnis pariwisata dengan menyediakan alat untuk mengelola pelanggan, membuat rencana perjalanan, menghasilkan faktur, dan lainnya.

## Fitur Utama
- Manajemen pelanggan
- Pembuatan dan perencanaan rencana perjalanan
- Template paket wisata
- Pembuatan dan pelacakan faktur
- Analitik bisnis dan pelaporan

## Memulai
1. Daftar/Masuk: Buat akun atau masuk untuk mengakses dasbor.
2. Siapkan Profil Anda: Perbarui detail bisnis Anda di bagian pengaturan.
3. Tambahkan Pelanggan: Mulai membangun database pelanggan Anda.
4. Buat Paket Wisata: Desain template tur yang dapat digunakan kembali.
5. Buat Rencana Perjalanan: Buat rencana perjalanan detail untuk pelanggan Anda.
6. Hasilkan Faktur: Buat dan kirim faktur profesional kepada pelanggan Anda.

## Dasbor
Dasbor memberikan gambaran cepat tentang performa bisnis pariwisata Anda dan akses ke semua fitur sistem, termasuk metrik utama, navigasi, dan tindakan cepat.

## Manajemen Pelanggan
Bagian manajemen pelanggan memungkinkan Anda menambahkan, mengedit, dan melacak informasi pelanggan Anda dan riwayat pemesanan.

## Manajemen Rencana Perjalanan
Bagian rencana perjalanan memungkinkan Anda membuat rencana perjalanan detail dengan aktivitas hari per hari, akomodasi, dan transportasi.

## Manajemen Paket Wisata
Paket wisata berfungsi sebagai template yang dapat dengan cepat dikonversi menjadi rencana perjalanan lengkap, menghemat waktu Anda saat membuat perjalanan serupa.

## Manajemen Faktur
Bagian faktur memungkinkan Anda membuat, mengelola, dan melacak pembayaran untuk layanan perjalanan Anda.

## Pengaturan Akun
Bagian pengaturan memungkinkan Anda menyesuaikan akun Anda, memperbarui informasi bisnis, dan mengelola preferensi sistem.
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare system context
    const systemContext = `Anda adalah asisten virtual untuk aplikasi TourGenius. Gunakan informasi berikut untuk membantu pengguna:

${knowledgeBase}

Berikan jawaban yang sopan dan singkat dalam Bahasa Indonesia. Jika Anda tidak tahu jawabannya, katakan saja Anda tidak tahu dan menyarankan mereka untuk menghubungi dukungan.`;

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemContext }],
        },
        {
          role: "model",
          parts: [{ text: "Saya siap membantu Anda dengan informasi tentang TourGenius!" }],
        },
      ],
    });

    // Format and add user messages to chat history
    const formattedMessages = messages.map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    }));

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    
    // Only send if it's a user message
    if (lastUserMessage.role === 'user') {
      const result = await chat.sendMessage(lastUserMessage.content);
      const response = result.response;
      return response.text();
    }
    
    return "Maaf, terjadi kesalahan dalam memproses pesan.";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti.";
  }
}
