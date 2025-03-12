
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CreateEventData } from "../types";

interface EventFormBasicFieldsProps {
  form: UseFormReturn<CreateEventData>;
}

export const EventFormBasicFields = ({ form }: EventFormBasicFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Título del evento" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descripción del evento" 
                className="min-h-32" 
                {...field} 
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
