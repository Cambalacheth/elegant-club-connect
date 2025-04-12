
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
          <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
            <SelectValue placeholder="Selecciona el tipo de precio" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="free">Gratuito</SelectItem>
          <SelectItem value="freemium">Freemium</SelectItem>
          <SelectItem value="paid">De pago</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
