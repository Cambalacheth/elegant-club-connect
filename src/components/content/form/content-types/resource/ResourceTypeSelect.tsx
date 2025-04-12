
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
          <SelectTrigger className="border-club-beige-dark focus:border-club-orange bg-white">
            <SelectValue placeholder="Selecciona el tipo de recurso" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white border-club-beige-dark shadow-lg z-50">
          <SelectItem value="template" className="hover:bg-club-beige/20">Template</SelectItem>
          <SelectItem value="tool" className="hover:bg-club-beige/20">Herramienta</SelectItem>
          <SelectItem value="book" className="hover:bg-club-beige/20">Libro</SelectItem>
          <SelectItem value="course" className="hover:bg-club-beige/20">Curso</SelectItem>
          <SelectItem value="software" className="hover:bg-club-beige/20">Software</SelectItem>
          <SelectItem value="document" className="hover:bg-club-beige/20">Documento</SelectItem>
          <SelectItem value="presentation" className="hover:bg-club-beige/20">Presentación</SelectItem>
          <SelectItem value="spreadsheet" className="hover:bg-club-beige/20">Hoja de cálculo</SelectItem>
          <SelectItem value="other" className="hover:bg-club-beige/20">Otro</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
