
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

interface ResourceSourceProps {
  field: ControllerRenderProps<any, "source">;
}

export const ResourceSource = ({ field }: ResourceSourceProps) => {
  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Fuente o autor</FormLabel>
      <FormControl>
        <Input 
          placeholder="Autor o creador del recurso" 
          {...field} 
          className="border-club-beige-dark focus:border-club-orange"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
