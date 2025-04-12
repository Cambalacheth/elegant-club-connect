
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";
import { 
  FileText, 
  FileImage, 
  Presentation, 
  FileSpreadsheet, 
  Code, 
  Lightbulb, 
  Laptop 
} from "lucide-react";

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
            <SelectValue placeholder="Selecciona un tipo de recurso" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white border-club-beige-dark shadow-lg z-[100]">
          <SelectItem value="tool" className="hover:bg-club-beige/20 font-medium flex items-center">
            <Laptop className="mr-2 h-4 w-4" />
            <span>Herramienta</span>
          </SelectItem>
          
          <SelectItem value="template" className="hover:bg-club-beige/20 font-medium flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Plantilla</span>
          </SelectItem>
          
          <SelectItem value="infographic" className="hover:bg-club-beige/20 font-medium flex items-center">
            <FileImage className="mr-2 h-4 w-4" />
            <span>Infografía</span>
          </SelectItem>
          
          <SelectItem value="document" className="hover:bg-club-beige/20 font-medium flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Documento</span>
          </SelectItem>
          
          <SelectItem value="presentation" className="hover:bg-club-beige/20 font-medium flex items-center">
            <Presentation className="mr-2 h-4 w-4" />
            <span>Presentación</span>
          </SelectItem>
          
          <SelectItem value="spreadsheet" className="hover:bg-club-beige/20 font-medium flex items-center">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Hoja de cálculo</span>
          </SelectItem>
          
          <SelectItem value="code" className="hover:bg-club-beige/20 font-medium flex items-center">
            <Code className="mr-2 h-4 w-4" />
            <span>Código/Snippet</span>
          </SelectItem>
          
          <SelectItem value="course" className="hover:bg-club-beige/20 font-medium flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Curso</span>
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
