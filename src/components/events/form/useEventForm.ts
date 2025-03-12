
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Event } from "@/types/event";
import { CreateEventData } from "../types";

export const useEventForm = (initialData?: Partial<Event>) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [revealDateLater, setRevealDateLater] = useState<boolean>(!initialData?.event_date);
  const [revealLocationLater, setRevealLocationLater] = useState<boolean>(!initialData?.location);
  
  const form = useForm<CreateEventData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      price: initialData?.price || "",
      reservation_link: initialData?.reservation_link || "",
      event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : ""
    }
  });

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      location: "",
      price: "",
      reservation_link: "",
      event_date: ""
    });
    setImagePreview(null);
    setRevealDateLater(false);
    setRevealLocationLater(false);
  };

  return {
    form,
    imagePreview,
    setImagePreview,
    revealDateLater,
    setRevealDateLater,
    revealLocationLater,
    setRevealLocationLater,
    resetForm
  };
};
