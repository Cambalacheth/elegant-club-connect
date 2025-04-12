
import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { useFileUpload } from "./useFileUpload";

interface ResourceFileUploadProps {
  field: ControllerRenderProps<any, "resourceUrl">;
  form: UseFormReturn<any>;
}

export const ResourceFileUpload = ({ field, form }: ResourceFileUploadProps) => {
  const { 
    isUploading, 
    uploadStatus, 
    handleFileUpload 
  } = useFileUpload({ form });

  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Recurso</FormLabel>
      <div className="space-y-2">
        <FormControl>
          <Input 
            placeholder="https://... o sube un archivo" 
            {...field} 
            className="border-club-beige-dark focus:border-club-orange"
          />
        </FormControl>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Subir archivo'}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            disabled={isUploading}
          />
          {form.watch('resourceUrl') && !isUploading && (
            <div className="flex items-center text-sm text-green-600">
              <FileText className="h-4 w-4 mr-1" />
              Archivo adjunto
            </div>
          )}
        </div>
        
        {uploadStatus && (
          <div className={`text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {uploadStatus}
          </div>
        )}
      </div>
      <FormMessage />
      <p className="text-xs text-gray-500 mt-1">
        Sube un archivo (PDF, Word, Excel, PowerPoint) o ingresa una URL externa
      </p>
    </FormItem>
  );
};
