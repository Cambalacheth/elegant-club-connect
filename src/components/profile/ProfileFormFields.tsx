
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

interface ProfileFormFieldsProps {
  form: UseFormReturn<any>;
  texts: Record<string, string>;
}

const ProfileFormFields = ({ form, texts }: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.usernameLabel}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.websiteLabel}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://your-website.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.genderLabel}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={texts.genderLabel} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">{texts.genderMale}</SelectItem>
                  <SelectItem value="female">{texts.genderFemale}</SelectItem>
                  <SelectItem value="other">{texts.genderOther}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{texts.birthDateLabel}</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email_visible"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                {texts.emailVisibleLabel}
                {field.value ? (
                  <Eye className="h-4 w-4 text-club-orange" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )}
              </FormLabel>
              <FormDescription>
                {field.value 
                  ? texts.emailVisibleOnDescription || texts.emailVisibleDescription
                  : texts.emailVisibleOffDescription || texts.emailVisibleDescription}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className={field.value ? "bg-club-orange" : ""}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{texts.descriptionLabel}</FormLabel>
            <FormControl>
              <Textarea
                rows={6}
                placeholder="Tell us about yourself"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileFormFields;
