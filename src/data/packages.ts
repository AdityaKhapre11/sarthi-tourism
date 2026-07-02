export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  id: number;
  name: string;
  image: string;
  duration: string;
  price: string;
  highlights: string[];
  description?: string;
  itinerary?: ItineraryItem[];
  included?: string[];
  excluded?: string[];
  gallery?: string[];
}

