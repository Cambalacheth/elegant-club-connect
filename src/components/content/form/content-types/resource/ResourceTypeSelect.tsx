
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";

interface ResourceTypeSelectProps {
  field: ControllerRenderProps<any, "resourceType">;
}

export const ResourceTypeSelect = ({ field }: ResourceTypeSelectProps) => {
  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Tipo de recurso</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className="border-club-beige-dark focus:border-club-orange bg-white shadow-sm">
            <SelectValue placeholder="Selecciona el tipo de recurso" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white border-club-beige-dark shadow-lg z-[100]">
          <SelectItem value="template" className="hover:bg-club-beige/20 font-medium">Template</SelectItem>
          <SelectItem value="tool" className="hover:bg-club-beige/20 font-medium">Herramienta</SelectItem>
          <SelectItem value="book" className="hover:bg-club-beige/20 font-medium">Libro</SelectItem>
          <SelectItem value="course" className="hover:bg-club-beige/20 font-medium">Curso</SelectItem>
          <SelectItem value="software" className="hover:bg-club-beige/20 font-medium">Software</SelectItem>
          <SelectItem value="document" className="hover:bg-club-beige/20 font-medium">Documento</SelectItem>
          <SelectItem value="presentation" className="hover:bg-club-beige/20 font-medium">Presentación</SelectItem>
          <SelectItem value="spreadsheet" className="hover:bg-club-beige/20 font-medium">Hoja de cálculo</SelectItem>
          <SelectItem value="other" className="hover:bg-club-beige/20 font-medium">Otro</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
