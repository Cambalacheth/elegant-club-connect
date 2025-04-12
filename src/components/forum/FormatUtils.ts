
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: es,
  });
};
