
interface Translations {
  dashboard: string;
  itinerary: string;
  invoices: string;
  customers: string;
  settings: string;
  logout: string;
  tourGenius: string;
  tourPlans: string;
}

export const getTranslations = (language: 'id' | 'en'): Translations => {
  const translations: Record<'en' | 'id', Translations> = {
    en: {
      dashboard: 'Dashboard',
      itinerary: 'Itinerary',
      invoices: 'Invoices',
      customers: 'Customers',
      settings: 'Settings',
      logout: 'Logout',
      tourGenius: 'TourGenius',
      tourPlans: 'Tour Plans'
    },
    id: {
      dashboard: 'Dasbor',
      itinerary: 'Rencana Perjalanan',
      invoices: 'Faktur',
      customers: 'Pelanggan',
      settings: 'Pengaturan',
      logout: 'Keluar',
      tourGenius: 'TourGenius',
      tourPlans: 'Paket Wisata'
    }
  };

  return translations[language];
};
