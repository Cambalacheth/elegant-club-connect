
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { CreateEventData } from "../types";

interface EventFormLocationProps {
  form: UseFormReturn<CreateEventData>;
  revealLocationLater: boolean;
  setRevealLocationLater: (value: boolean) => void;
}

export const EventFormLocation = ({ 
  form, 
  revealLocationLater, 
  setRevealLocationLater 
}: EventFormLocationProps) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ubicación</FormLabel>
          <div className="space-y-2">
            <FormControl>
              <Input 
                placeholder="Ubicación del evento" 
                {...field} 
                disabled={revealLocationLater}
              />
            </FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reveal-location-later" 
                checked={revealLocationLater}
                onCheckedChange={(checked) => {
                  setRevealLocationLater(checked as boolean);
                  if (checked) {
                    form.setValue('location', '');
                  }
                }}
              />
              <label 
                htmlFor="reveal-location-later" 
                className="text-sm cursor-pointer"
              >
                Revelar ubicación más adelante
              </label>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
