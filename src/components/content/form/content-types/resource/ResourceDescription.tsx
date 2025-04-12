
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";

interface ResourceDescriptionProps {
  field: ControllerRenderProps<any, "description">;
}

export const ResourceDescription = ({ field }: ResourceDescriptionProps) => {
  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Descripción</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Descripción del recurso" 
          className="min-h-[100px] border-club-beige-dark focus:border-club-orange" 
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
