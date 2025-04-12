
import { ContentType } from "@/types/content";

export function getTypeLabel(type?: ContentType): string {
  if (!type) return "Contenido";
  switch (type) {
    case "article": return "Artículo";
    case "video": return "Video";
    case "guide": return "Guía";
    case "resource": return "Recurso";
    default: return "Contenido";
  }
}

export function getDifficultyLabel(difficulty?: string): string {
  if (!difficulty) return "";
  switch (difficulty) {
    case "basic": return "Básico";
    case "intermediate": return "Intermedio";
    case "advanced": return "Avanzado";
    default: return difficulty;
  }
}

export function getPriceLabel(price?: string): string {
  if (!price) return "";
  switch (price) {
    case "free": return "Gratuito";
    case "freemium": return "Freemium";
    case "paid": return "De pago";
    default: return price;
  }
}
