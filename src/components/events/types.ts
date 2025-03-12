
import { Event } from "@/types/event";

export type CreateEventData = {
  title: string;
  description: string;
  location?: string;
  price?: string;
  event_date?: string;
  image_url?: string;
  reservation_link?: string;
};

export interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: CreateEventData) => Promise<void>;
  isSubmitting: boolean;
}
