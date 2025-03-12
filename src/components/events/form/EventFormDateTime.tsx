
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { CreateEventData } from "../types";

interface EventFormDateTimeProps {
  form: UseFormReturn<CreateEventData>;
  revealDateLater: boolean;
  setRevealDateLater: (value: boolean) => void;
}

export const EventFormDateTime = ({ 
  form, 
  revealDateLater, 
  setRevealDateLater 
}: EventFormDateTimeProps) => {
  return (
    <FormField
      control={form.control}
      name="event_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fecha y hora</FormLabel>
          <div className="space-y-2">
            <FormControl>
              <Input 
                type="datetime-local" 
                {...field} 
                disabled={revealDateLater}
              />
            </FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reveal-date-later" 
                checked={revealDateLater}
                onCheckedChange={(checked) => {
                  setRevealDateLater(checked as boolean);
                  if (checked) {
                    form.setValue('event_date', '');
                  }
                }}
              />
              <label 
                htmlFor="reveal-date-later" 
                className="text-sm cursor-pointer"
              >
                Revelar fecha más adelante
              </label>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
