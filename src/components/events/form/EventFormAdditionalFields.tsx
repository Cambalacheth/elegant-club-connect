
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateEventData } from "../types";

interface EventFormAdditionalFieldsProps {
  form: UseFormReturn<CreateEventData>;
}

export const EventFormAdditionalFields = ({ form }: EventFormAdditionalFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio</FormLabel>
            <FormControl>
              <Input placeholder="Precio del evento (opcional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="reservation_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enlace de reserva</FormLabel>
            <FormControl>
              <Input placeholder="Enlace para reservar (opcional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
