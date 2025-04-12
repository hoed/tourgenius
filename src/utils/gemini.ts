
// Gemini AI integration using Google GenAI library
import { GoogleGenerativeAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyCMHA5m4CLdcIok9OOto5q-HbNiKn27GJU";

// Initialize the Google GenAI client with proper API key format
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
    // Get the Gemini-2.0-flash model - corrected method name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prepare the system context with knowledge base
    const systemContext = `Anda adalah asisten virtual untuk aplikasi TourGenius. Gunakan informasi berikut untuk membantu pengguna:

${knowledgeBase}

Berikan jawaban yang sopan dan singkat dalam Bahasa Indonesia. Jika Anda tidak tahu jawabannya, katakan saja Anda tidak tahu dan menyarankan mereka untuk menghubungi dukungan.`;

    // Format the conversation for the Gemini chat model
    const formattedMessages = [
      { role: 'user', parts: [{ text: systemContext }] },
    ];

    // Add the conversation history
    for (const message of messages) {
      formattedMessages.push({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }]
      });
    }

    // Generate content using the Gemini model
    const result = await model.generateContent({
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // Extract the response text
    const response = result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti.";
  }
}
