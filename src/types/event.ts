
export interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  location?: string;
  reservation_link?: string;
  price?: string;
  event_date?: string;
  created_at: string;
  updated_at: string;
}
