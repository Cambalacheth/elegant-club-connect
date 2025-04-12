
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";

interface ResourcePriceSelectProps {
  field: ControllerRenderProps<any, "price">;
}

export const ResourcePriceSelect = ({ field }: ResourcePriceSelectProps) => {
  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Precio</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className="border-club-beige-dark focus:border-club-orange bg-white shadow-sm">
            <SelectValue placeholder="Selecciona una opción de precio" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white border-club-beige-dark shadow-lg z-[100]">
          <SelectItem value="free" className="hover:bg-club-beige/20 font-medium">Gratis</SelectItem>
          <SelectItem value="freemium" className="hover:bg-club-beige/20 font-medium">Freemium</SelectItem>
          <SelectItem value="paid" className="hover:bg-club-beige/20 font-medium">De pago</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
