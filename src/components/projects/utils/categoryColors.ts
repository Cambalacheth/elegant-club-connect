
/**
 * Returns the Tailwind class names for a given project category
 */
export const getCategoryColor = (category: string) => {
  switch (category) {
    case "Legal":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "Tecnología":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
    case "Finanzas":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    case "Audiovisual":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    case "Comunidad":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
    case "Salud":
      return "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  }
};
