
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

interface LanguageSectionProps {
  form: any;
  currentLanguage: string;
}

const LanguageSection = ({ form, currentLanguage }: LanguageSectionProps) => {
  const languageOptions = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ca", label: "Català" },
  ];

  const texts = {
    preferredLanguageLabel: currentLanguage === "en" ? "Preferred Language" : "Idioma Preferido",
    speaksLanguagesLabel: currentLanguage === "en" ? "Languages I Speak" : "Idiomas que Hablo",
    learningLanguagesLabel: currentLanguage === "en" ? "Languages I'm Learning" : "Idiomas que Estoy Aprendiendo",
    selectLanguage: currentLanguage === "en" ? "Select language" : "Seleccionar idioma",
    selectLanguages: currentLanguage === "en" ? "Select languages" : "Seleccionar idiomas",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-club-brown">
        {currentLanguage === "en" ? "Language Settings" : "Configuración de Idiomas"}
      </h3>

      <FormField
        control={form.control}
        name="preferred_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{texts.preferredLanguageLabel}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={texts.selectLanguage} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="speaks_languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{texts.speaksLanguagesLabel}</FormLabel>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                options={languageOptions}
                placeholder={texts.selectLanguages}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="learning_languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{texts.learningLanguagesLabel}</FormLabel>
            <FormControl>
              <MultiSelect
                selected={field.value || []}
                options={languageOptions}
                placeholder={texts.selectLanguages}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LanguageSection;
