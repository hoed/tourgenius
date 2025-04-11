
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the key
const genAI = new GoogleGenerativeAI(
  "AIzaSyCMHA5m4CLdcIok9OOto5q-HbNiKn27GJU"
);

// Create a chat model
export const createChatModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// Function to generate chat responses
export const generateChatResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const model = createChatModel();
    
    // Convert the messages to Gemini's format
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role as "user" | "model",
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 800,
      },
    });
    
    // Get the user's latest message
    const userMessage = messages[messages.length - 1].content;
    
    // Generate a response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm having trouble connecting to my brain. Please try again later.";
  }
};

// This context includes knowledge about the TourGenius application based on the manual
export const tourGeniusContext = `
TourGenius adalah aplikasi manajemen bisnis tour dan travel yang komprehensif, dirancang untuk membuat operasi bisnis pariwisata lebih efisien dan profesional.

FITUR UTAMA:
1. Perencanaan Rencana Perjalanan: Buat, edit, dan kelola itinerari untuk klien Anda.
2. Pembuatan Faktur: Hasilkan faktur profesional secara instan dengan rincian perjalanan.
3. Manajemen Pelanggan: Simpan dan kelola informasi kontak dan preferensi pelanggan.
4. Paket Wisata: Buat template paket wisata yang dapat digunakan kembali.
5. Dashboard Analitik: Pantau performa bisnis dengan analitik yang mudah dipahami.
6. Multi-bahasa: Dukungan bahasa Inggris dan Indonesia.

CARA PENGGUNAAN:
- Navigasi: Gunakan panel navigasi di sebelah kiri untuk beralih antara Dashboard, Itinerary, Faktur, Pelanggan, dan Pengaturan.
- Rencana Perjalanan: Buat rencana perjalanan dengan menambahkan hari, tujuan wisata, akomodasi, makan, dan transportasi.
- Faktur: Buat faktur berdasarkan rencana perjalanan dengan harga dan detail yang sesuai.
- Pelanggan: Tambahkan dan kelola data pelanggan untuk referensi di masa mendatang.
- Paket Wisata: Buat paket wisata standar yang dapat disesuaikan untuk klien individu.
- Pengaturan: Sesuaikan pengaturan profil dan preferensi aplikasi.

HARGA:
- Basic: IDR 150.000/bulan (1 Akun Pengguna, Hingga 5 Rencana Perjalanan per Bulan)
- Pro: IDR 350.000/bulan (Hingga 5 Akun Pengguna, Rencana Perjalanan Tak Terbatas)
- Enterprise: Hubungi Kami (Akun Pengguna Tak Terbatas, Fitur Kustom)

Sebagai asisten TourGenius, saya akan membantu menjawab pertanyaan Anda tentang cara menggunakan aplikasi ini dan bagaimana fitur-fiturnya dapat membantu bisnis pariwisata Anda.
`;
