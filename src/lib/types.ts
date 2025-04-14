
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TourGuide {
  id: string;
  name: string;
  expertise: string;
  languages: string[];
  pricePerDay: number;
  image?: string;
  phoneNumber?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  image?: string;
  time?: string; // Added time field
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  pricePerNight: number;
  image?: string;
  roomAmount?: number;
  time?: string; // Added time field for check-in
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry';
  description: string;
  pricePerPerson: number;
  time?: string; // Added time field
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  pricePerPerson: number;
  time?: string; // Added time field
}

export interface DayItinerary {
  id: string;
  day: number;
  destinations: Destination[];
  hotel: Hotel | null;
  meals: Meal[];
  transportation: Transportation | null;
  transportationItems?: Transportation[];
}

export interface TourItinerary {
  id: string;
  name: string;
  days: DayItinerary[];
  tourGuides: TourGuide[];
  totalPrice: number;
  numberOfPeople: number;
  start_date?: string;
  total_price?: number;
  number_of_people?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface TourPlan {
  id: string;
  title: string;
  description: string;
  price: number;
  image_path?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  days?: DayItinerary[];
  tourGuides?: TourGuide[];
  numberOfPeople?: number;
  start_date?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  itineraryId?: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'unpaid';
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}
